import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { createSessionToken, hashPassword, publicUser, setAuthCookie, validatePasswordStrength } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import User from "@/models/User";

function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40);
}

async function createSupabasePasswordUser(username: string, email: string, password: string) {
  const supabase = getSupabaseServerClient();
  const normalizedUsername = normalizeUsername(username);
  const normalizedEmail = email.toLowerCase().trim();

  const { data, error } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: {
      username: normalizedUsername,
      full_name: normalizedUsername,
    },
  });

  if (error || !data.user) {
    const duplicate = error?.message?.toLowerCase().includes("already") || error?.status === 422;
    return NextResponse.json(
      { error: duplicate ? "User or email already exists" : error?.message || "Signup failed" },
      { status: duplicate ? 409 : 500 },
    );
  }

  const user = {
    _id: data.user.id,
    username: normalizedUsername,
    email: normalizedEmail,
    avatarUrl: "",
    authProvider: "supabase",
  };
  const token = createSessionToken(user);
  const response = NextResponse.json({ message: "User created successfully", token, user: publicUser(user) }, { status: 201 });
  setAuthCookie(response, token);
  return response;
}

export async function POST(request: Request) {
  let payload: { username?: string; email?: string; password?: string } = {};

  try {
    payload = await request.json();
    const { username, email, password } = payload;

    if (!username || !email || !password || typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedUsername = normalizeUsername(username);
    const normalizedEmail = email.toLowerCase().trim();
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

    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: await hashPassword(password),
      authProvider: "password",
      lastLoginAt: new Date(),
    });

    const token = createSessionToken(user);
    const response = NextResponse.json({ message: "User created successfully", token, user: publicUser(user) }, { status: 201 });
    setAuthCookie(response, token);
    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    const duplicate = error?.code === 11000;
    if (!duplicate && payload.username && payload.email && payload.password) {
      try {
        return await createSupabasePasswordUser(payload.username, payload.email, payload.password);
      } catch (supabaseError) {
        console.error("Supabase signup fallback error:", supabaseError);
      }
    }
    return NextResponse.json({ error: duplicate ? "User or email already exists" : "Internal server error" }, { status: duplicate ? 409 : 500 });
  }
}
