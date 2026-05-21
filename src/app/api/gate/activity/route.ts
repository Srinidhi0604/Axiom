import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import GateActivity from "@/models/GateActivity";
import User from "@/models/User";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";

/**
 * POST /api/gate/activity
 * Body: { questionId, streamId, subjectId, correct }
 *
 * Records a solved GATE question for the logged-in user.
 * Also increments User.problemsSolved and User.score.
 */
export async function POST(request: Request) {
  try {
    await connectToDatabase();

    // ── Auth ──────────────────────────────────────────────────────────
    const authHeader = request.headers.get("authorization");
    const bearer = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const token = bearer || (await getTokenFromCookies());

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as { userId?: string; sub?: string } | null;
    const userId = decoded?.userId || decoded?.sub;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // ── Body ──────────────────────────────────────────────────────────
    const body = await request.json();
    const {
      questionId,
      streamId = "cs",
      subjectId = "",
      correct = true,
    } = body as {
      questionId: string;
      streamId?: string;
      subjectId?: string;
      correct?: boolean;
    };

    if (!questionId) {
      return NextResponse.json({ error: "questionId is required" }, { status: 400 });
    }

    // ── Save activity ─────────────────────────────────────────────────
    const activity = await GateActivity.create({
      userId,
      questionId,
      streamId,
      subjectId,
      correct,
      solvedAt: new Date(),
    });

    // ── Update user aggregate counts ──────────────────────────────────
    if (correct) {
      await User.findByIdAndUpdate(userId, {
        $inc: { problemsSolved: 1, score: 10 },
        $addToSet: { solvedProblems: questionId },
      });
    }

    return NextResponse.json({ success: true, activityId: activity._id });
  } catch (err) {
    console.error("Gate activity POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
