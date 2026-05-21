import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    // Require authentication to fetch user list
    const token = await getTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyToken(token) as any;
    if (!decoded?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch users, sorted by score descending
    const users = await User.find({})
      .select("username score problemsSolved referralCode referralCount createdAt")
      .sort({ score: -1 })
      .lean();

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
