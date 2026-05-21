import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import connectToDatabase from "@/lib/mongodb";
import { comparePassword, createSessionToken, publicUser, setAuthCookie } from "@/lib/auth";
import User from "@/models/User";

function makeReferralCode(username: string, idOrEmail: string) {
  const base = username.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) || "AXIOM";
  const suffix = idOrEmail.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase() || Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${base}${suffix}`;
}

async function signInWithSupabasePassword(email: string, password: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const supabase = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password,
  });

  if (error || !data.user?.email) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const usernameFromMetadata =
    typeof data.user.user_metadata?.username === "string"
      ? data.user.user_metadata.username
      : typeof data.user.user_metadata?.full_name === "string"
        ? data.user.user_metadata.full_name
        : data.user.email.split("@")[0];

  const user = {
    _id: data.user.id,
    username: usernameFromMetadata.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40) || "axiom_user",
    email: data.user.email.toLowerCase().trim(),
    avatarUrl: typeof data.user.user_metadata?.avatar_url === "string" ? data.user.user_metadata.avatar_url : "",
    authProvider: "supabase",
    referralCode: typeof data.user.user_metadata?.referralCode === "string" ? data.user.user_metadata.referralCode : "",
    referredBy: typeof data.user.user_metadata?.referredBy === "string" ? data.user.user_metadata.referredBy : "",
    referralCount: Number(data.user.user_metadata?.referralCount || 0),
    score: Number(data.user.user_metadata?.score || 0),
  };
  const token = createSessionToken(user);
  const response = NextResponse.json({
    message: "Login successful",
    token,
    user: publicUser(user),
  });
  setAuthCookie(response, token);
  return response;
}

export async function POST(request: Request) {
  let payload: { email?: string; password?: string } = {};

  try {
    payload = await request.json();
    const { email, password } = payload;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user?.password) {
      return signInWithSupabasePassword(email, password);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return signInWithSupabasePassword(email, password);
    }

    user.lastLoginAt = new Date();
    
    // Generate referral code if missing (for older accounts)
    if (!user.referralCode) {
      user.referralCode = makeReferralCode(user.username, String(user._id));
    }
    
    await user.save();

    const token = createSessionToken(user);
    const response = NextResponse.json({
      message: "Login successful",
      token,
      user: publicUser(user),
    });
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error("Signin error:", error);
    if (payload.email && payload.password) {
      try {
        return await signInWithSupabasePassword(payload.email, payload.password);
      } catch (supabaseError) {
        console.error("Supabase signin fallback error:", supabaseError);
      }
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
