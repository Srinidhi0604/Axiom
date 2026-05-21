import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { comparePassword, createSessionToken, publicUser, setAuthCookie } from "@/lib/auth";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user?.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    user.lastLoginAt = new Date();
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
