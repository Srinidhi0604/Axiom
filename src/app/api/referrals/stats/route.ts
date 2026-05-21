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

function decodeSupabaseAccessToken(accessToken: string): { id: string } | null {
  try {
    // Clean the token first
    const cleanToken = (accessToken || "").trim();
    if (!cleanToken || cleanToken.split(".").length !== 3) {
      console.error("Invalid token format - expected 3 parts, got:", cleanToken.split(".").length);
      return null;
    }

    const [, payload] = cleanToken.split(".");
    if (!payload) {
      console.error("No payload found in token");
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(Buffer.from(normalized, "base64").toString("utf8"));
    const id = typeof decoded.sub === "string" ? decoded.sub : "";

    if (!id) {
      console.error("No 'sub' claim found in token payload");
      return null;
    }
    
    console.log("Successfully decoded Supabase token, sub:", id);
    return { id };
  } catch (error) {
    console.error("Failed to decode Supabase token:", error instanceof Error ? error.message : String(error));
    return null;
  }
}

export async function GET(request: Request) {
  try {
    let token = await getTokenFromCookies();

    // Fallback: check Authorization header
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      console.error("No token found in cookies or headers");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userId: string | null = null;

    // Try to verify as JWT first
    try {
      const decoded = verifyToken(token) as any;
      if (decoded?.id) {
        userId = decoded.id;
        console.log("Decoded as JWT, userId:", userId);
      }
    } catch (jwtError) {
      console.log("JWT decode failed, trying Supabase token:", jwtError instanceof Error ? jwtError.message : String(jwtError));
      // Not a JWT, try Supabase token
      const supabaseDecoded = decodeSupabaseAccessToken(token);
      if (supabaseDecoded?.id) {
        userId = supabaseDecoded.id;
        console.log("Decoded as Supabase token, userId:", userId);
      } else {
        console.error("Failed to decode as Supabase token");
      }
    }

    if (!userId) {
      console.error("Could not extract userId from token");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById(userId).select(
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
