import { NextResponse } from "next/server";
import connectToDatabase, { isDatabaseConfigured } from "@/lib/mongodb";
import GateActivity from "@/models/GateActivity";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";

/**
 * GET /api/gate/heatmap?stream=cs&year=2025
 *
 * Returns monthly question counts for the logged-in user.
 * Response shape:
 * {
 *   months: [
 *     { month: 0, year: 2025, weeks: [4, 7, 2, 8, 5] },   // Jan
 *     ...
 *   ],
 *   total: 142
 * }
 *
 * Each month has 5 "week buckets" (days 1-7, 8-14, 15-21, 22-28, 29-31).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const streamId = searchParams.get("stream") ?? "cs";
    const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()), 10);

    if (!isDatabaseConfigured()) {
      return NextResponse.json({
        months: Array.from({ length: 12 }, () => [0, 0, 0, 0, 0]),
        total: 0,
        year,
        streamId,
      });
    }

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

    // ── Query params ───────────────────────────────────────────────────
    const startDate = new Date(year, 0, 1);   // Jan 1
    const endDate   = new Date(year + 1, 0, 1); // Jan 1 next year

    // ── MongoDB aggregation ────────────────────────────────────────────
    const pipeline = [
      {
        $match: {
          userId: { $eq: userId.toString() },
          streamId,
          solvedAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        // Extract month (0-based) and day-of-month
        $project: {
          month: { $subtract: [{ $month: "$solvedAt" }, 1] }, // 0-indexed
          day:   { $dayOfMonth: "$solvedAt" },
        },
      },
      {
        // Bucket day → week index 0..4
        $project: {
          month: 1,
          week: {
            $switch: {
              branches: [
                { case: { $lte: ["$day",  7] }, then: 0 },
                { case: { $lte: ["$day", 14] }, then: 1 },
                { case: { $lte: ["$day", 21] }, then: 2 },
                { case: { $lte: ["$day", 28] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      {
        $group: {
          _id: { month: "$month", week: "$week" },
          count: { $sum: 1 },
        },
      },
    ];

    const raw = await GateActivity.aggregate(pipeline as Parameters<typeof GateActivity.aggregate>[0]);

    // ── Shape into 12×5 matrix ─────────────────────────────────────────
    const months: number[][] = Array.from({ length: 12 }, () => [0, 0, 0, 0, 0]);

    for (const doc of raw) {
      const m = doc._id.month as number;
      const w = doc._id.week as number;
      if (m >= 0 && m < 12 && w >= 0 && w < 5) {
        months[m][w] = doc.count as number;
      }
    }

    const total = months.flat().reduce((s, v) => s + v, 0);

    return NextResponse.json({ months, total, year, streamId });
  } catch (err) {
    console.error("Heatmap GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
