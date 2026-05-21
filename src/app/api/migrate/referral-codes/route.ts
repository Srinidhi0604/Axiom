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

/**
 * POST /api/migrate/referral-codes
 * Generates missing referral codes for older accounts
 * Requires authentication
 */
export async function POST(request: Request) {
  try {
    // Verify authentication (admin-level operation)
    const token = await getTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as any;
    if (!decoded?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectToDatabase();

    // Get the current user to check if they're running the migration
    const currentUser = await User.findById(decoded.id);
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
