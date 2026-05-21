import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";
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

/**
 * POST /api/migrate/referral-codes
 * Generates missing referral codes for older accounts
 * Requires authentication
 */
export async function POST(request: Request) {
  try {
    let token: string | null = null;

    // Try multiple auth methods
    // 1. Authorization header
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
      console.log("POST: Token from Authorization header");
    }

    // 2. Request body
    if (!token) {
      try {
        const body = await request.json().catch(() => ({}));
        if (body.token) {
          token = body.token;
          console.log("POST: Token from request body");
        }
      } catch {
        // ignore
      }
    }

    // 3. Cookies
    if (!token) {
      token = await getTokenFromCookies();
      if (token) {
        console.log("POST: Token from cookies");
      }
    }

    if (!token) {
      console.error("POST: No token found anywhere");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userId: string | null = null;

    // Try to verify as JWT first
    try {
      const decoded = verifyToken(token) as any;
      if (decoded?.id) {
        userId = decoded.id;
        console.log("POST: Decoded as JWT, userId:", userId);
      }
    } catch (jwtError) {
      console.log("POST: JWT decode failed, trying Supabase token");
      // Not a JWT, try Supabase token
      const supabaseDecoded = decodeSupabaseAccessToken(token);
      if (supabaseDecoded?.id) {
        userId = supabaseDecoded.id;
        console.log("POST: Decoded as Supabase token, userId:", userId);
      }
    }

    if (!userId) {
      console.error("POST: Could not extract userId from token");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectToDatabase();

    // Get the current user to check if they're running the migration
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find all users without referral codes
    const usersWithoutCodes = await User.find({
      $or: [{ referralCode: { $exists: false } }, { referralCode: null }, { referralCode: "" }],
    });

    let migratedCount = 0;

    for (const user of usersWithoutCodes) {
      try {
        // Generate a unique referral code
        const newCode = makeReferralCode(user.username, String(user._id));

        // Check if this code already exists (collision check)
        const existingCode = await User.findOne({
          referralCode: newCode,
          _id: { $ne: user._id },
        });

        if (!existingCode) {
          user.referralCode = newCode;
          await user.save();
          migratedCount++;
        } else {
          // If collision, try with random suffix
          user.referralCode = `${newCode}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
          await user.save();
          migratedCount++;
        }
      } catch (error) {
        console.error(`Failed to migrate referral code for user ${user._id}:`, error);
        // Continue with other users
      }
    }

    // Also ensure current user has a code
    if (!currentUser.referralCode) {
      const newCode = makeReferralCode(currentUser.username, String(currentUser._id));
      currentUser.referralCode = newCode;
      await currentUser.save();
      migratedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Migrated ${migratedCount} users with new referral codes`,
      migratedCount,
      totalWithoutCodes: usersWithoutCodes.length,
    });
  } catch (error) {
    console.error("Referral code migration error:", error);
    return NextResponse.json(
      { error: "Migration failed" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/migrate/referral-codes
 * Check migration status
 */
export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const usersWithoutCodes = await User.countDocuments({
      $or: [
        { referralCode: { $exists: false } },
        { referralCode: null },
        { referralCode: "" },
      ],
    });

    const totalUsers = await User.countDocuments({});

    return NextResponse.json({
      success: true,
      totalUsers,
      usersWithoutCodes,
      percentageCovered: totalUsers > 0 ? ((totalUsers - usersWithoutCodes) / totalUsers * 100).toFixed(2) : "0",
    });
  } catch (error) {
    console.error("Referral code status check error:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}
