import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Require authentication to view leaderboard
    const token = await getTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyToken(token) as any;
    if (!decoded?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectToDatabase();

    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 100);
    const skip = Math.max(Number(url.searchParams.get("skip")) || 0, 0);

    // Fetch top referrers
    const topReferrers = await User.find({ referralCount: { $gt: 0 } })
      .select("username referralCount score avatarUrl createdAt")
      .sort({ referralCount: -1, score: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    // Get total count for pagination
    const totalCount = await User.countDocuments({ referralCount: { $gt: 0 } });

    const leaderboard = topReferrers.map((user, index) => ({
      rank: skip + index + 1,
      username: user.username,
      avatarUrl: user.avatarUrl || "",
      referralCount: user.referralCount || 0,
      score: user.score || 0,
      joinedAt: user.createdAt,
    }));

    return NextResponse.json({
      success: true,
      leaderboard,
      pagination: {
        total: totalCount,
        limit,
        skip,
        hasMore: skip + limit < totalCount,
      },
    });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
