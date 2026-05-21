import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { createSessionToken, hashPassword, publicUser, setAuthCookie, validatePasswordStrength } from "@/lib/auth";
import User from "@/models/User";

function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40);
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { username, email, password } = await request.json();

    if (!username || !email || !password || typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedUsername = normalizeUsername(username);
    const normalizedEmail = email.toLowerCase().trim();
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.errors.join(". ") }, { status: 400 });
    }

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
    return NextResponse.json({ error: duplicate ? "User or email already exists" : "Internal server error" }, { status: duplicate ? 409 : 500 });
  }
}
