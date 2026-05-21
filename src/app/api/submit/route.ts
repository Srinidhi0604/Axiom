import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { problemId, points } = await request.json();

    const authHeader = request.headers.get("authorization");
    const bearer = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const token = bearer || await getTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as { userId?: string; sub?: string; email?: string } | null;
    const userId = decoded?.userId || decoded?.sub;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Keep track of solved problem IDs
    if (!user.solvedProblems) {
      user.solvedProblems = [];
    }

    if (user.solvedProblems.includes(problemId)) {
      return NextResponse.json({
        success: true,
        message: "Already solved",
        user,
      });
    }

    user.solvedProblems.push(problemId);
    user.problemsSolved += 1;
    user.score += points || 10;
    await user.save();

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
