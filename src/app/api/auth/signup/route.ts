import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { createSessionToken, hashPassword, publicUser, setAuthCookie, validatePasswordStrength } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import User from "@/models/User";

const REFERRAL_BONUS_POINTS = 50;

function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40);
}

function normalizeReferralCode(value?: string) {
  return (value || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
}

function makeReferralCode(username: string, idOrEmail: string) {
  const base = normalizeUsername(username).replace(/_/g, "").toUpperCase().slice(0, 8) || "AXIOM";
  const suffix = idOrEmail.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase() || Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${base}${suffix}`;
}

async function createSupabasePasswordUser(username: string, email: string, password: string, referralCode?: string) {
  const supabase = getSupabaseServerClient();
  const normalizedUsername = normalizeUsername(username);
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedReferral = normalizeReferralCode(referralCode);
  let referrer: any = null;

  if (normalizedReferral) {
    const { data } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    referrer = data.users.find((candidate) => {
      const candidateCode = normalizeReferralCode(
        typeof candidate.user_metadata?.referralCode === "string" ? candidate.user_metadata.referralCode : "",
      );
      return candidateCode === normalizedReferral;
    });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: {
      username: normalizedUsername,
      full_name: normalizedUsername,
      referredBy: referrer ? normalizedReferral : "",
    },
  });

  if (error || !data.user) {
    const duplicate = error?.message?.toLowerCase().includes("already") || error?.status === 422;
    return NextResponse.json(
      { error: duplicate ? "User or email already exists" : error?.message || "Signup failed" },
      { status: duplicate ? 409 : 500 },
    );
  }

  const newReferralCode = makeReferralCode(normalizedUsername, data.user.id);

  await supabase.auth.admin.updateUserById(data.user.id, {
    user_metadata: {
      ...(data.user.user_metadata || {}),
      username: normalizedUsername,
      full_name: normalizedUsername,
      referralCode: newReferralCode,
      referredBy: referrer ? normalizedReferral : "",
    },
  });

  if (referrer) {
    await supabase.auth.admin.updateUserById(referrer.id, {
      user_metadata: {
        ...(referrer.user_metadata || {}),
        referralCode: normalizedReferral,
        referralCount: Number(referrer.user_metadata?.referralCount || 0) + 1,
        score: Number(referrer.user_metadata?.score || 0) + REFERRAL_BONUS_POINTS,
      },
    });
  }

  const user = {
    _id: data.user.id,
    username: normalizedUsername,
    email: normalizedEmail,
    avatarUrl: "",
    authProvider: "supabase",
    referralCode: newReferralCode,
    referredBy: referrer ? normalizedReferral : "",
    referralCount: 0,
    score: 0,
  };
  const token = createSessionToken(user);
  const response = NextResponse.json({ message: "User created successfully", token, user: publicUser(user) }, { status: 201 });
  setAuthCookie(response, token);
  return response;
}

export async function POST(request: Request) {
  let payload: { username?: string; email?: string; password?: string; referralCode?: string } = {};

  try {
    payload = await request.json();
    const { username, email, password } = payload;

    if (!username || !email || !password || typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedUsername = normalizeUsername(username);
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedReferral = normalizeReferralCode(payload.referralCode);
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.errors.join(". ") }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });
    if (existingUser) {
      return NextResponse.json({ error: "User or email already exists" }, { status: 409 });
    }

    let referrer = null;
    if (normalizedReferral) {
      referrer = await User.findOne({ referralCode: normalizedReferral });
    }

    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: await hashPassword(password),
      authProvider: "password",
      referralCode: makeReferralCode(normalizedUsername, normalizedEmail),
      referredBy: referrer ? normalizedReferral : "",
      lastLoginAt: new Date(),
    });

    if (referrer && String(referrer._id) !== String(user._id)) {
      referrer.referralCount = (referrer.referralCount || 0) + 1;
      referrer.score = (referrer.score || 0) + REFERRAL_BONUS_POINTS;
      await referrer.save();
    }

    const token = createSessionToken(user);
    const response = NextResponse.json({ message: "User created successfully", token, user: publicUser(user) }, { status: 201 });
    setAuthCookie(response, token);
    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    const duplicate = error?.code === 11000;
    if (!duplicate && payload.username && payload.email && payload.password) {
      try {
        return await createSupabasePasswordUser(payload.username, payload.email, payload.password, payload.referralCode);
      } catch (supabaseError) {
        console.error("Supabase signup fallback error:", supabaseError);
      }
    }
    return NextResponse.json({ error: duplicate ? "User or email already exists" : "Internal server error" }, { status: duplicate ? 409 : 500 });
  }
}
