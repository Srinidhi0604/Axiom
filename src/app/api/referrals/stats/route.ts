import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getTokenFromCookies } from "@/lib/auth";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";

function makeReferralCode(username: string, idOrEmail: string) {
  const base = username
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8) || "AXIOM";
  const suffix =
    idOrEmail
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(-6)
      .toUpperCase() || Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${base}${suffix}`;
}

export async function GET(request: Request) {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as any;
    if (!decoded?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById(decoded.id).select(
      "username referralCode referralCount score referredBy"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate referral code if missing (for older accounts)
    if (!user.referralCode) {
      user.referralCode = makeReferralCode(user.username, String(user._id));
      await user.save();
    }

    // Find users who were referred by this user
    const referredUsers = await User.find({ referredBy: user.referralCode })
      .select("username avatarUrl score createdAt")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({
      success: true,
      referralStats: {
        username: user.username,
        referralCode: user.referralCode,
        referralCount: user.referralCount || 0,
        referredBy: user.referredBy || null,
        totalScore: user.score || 0,
        bonusFromReferrals: (user.referralCount || 0) * 50,
      },
      referredUsers: referredUsers.map((u) => ({
        username: u.username,
        avatarUrl: u.avatarUrl || "",
        score: u.score || 0,
        joinedAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error("User referral stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch referral stats" },
      { status: 500 }
    );
  }
}
