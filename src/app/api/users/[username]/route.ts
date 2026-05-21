import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import User from "@/models/User";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40);
}

async function findSupabaseProfile(username: string) {
  const supabase = getSupabaseServerClient();
  const target = normalizeUsername(username);
  let page = 1;
  const perPage = 1000;

  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) throw error;

    const match = data.users.find((candidate) => {
      const metadataUsername =
        typeof candidate.user_metadata?.username === "string"
          ? candidate.user_metadata.username
          : typeof candidate.user_metadata?.full_name === "string"
            ? candidate.user_metadata.full_name
            : candidate.email?.split("@")[0] || "";
      const generatedUsername = `${normalizeUsername(metadataUsername || "axiom_user")}_${candidate.id.slice(-6)}`;

      return normalizeUsername(metadataUsername) === target || generatedUsername === target;
    });

    if (match?.email) {
      const metadataUsername =
        typeof match.user_metadata?.username === "string"
          ? match.user_metadata.username
          : typeof match.user_metadata?.full_name === "string"
            ? match.user_metadata.full_name
            : match.email.split("@")[0];
      const profileUsername = normalizeUsername(metadataUsername) || `${normalizeUsername(match.email.split("@")[0])}_${match.id.slice(-6)}`;

      return {
        _id: match.id,
        id: match.id,
        username: profileUsername,
        email: match.email,
        avatarUrl:
          typeof match.user_metadata?.avatar_url === "string"
            ? match.user_metadata.avatar_url
            : typeof match.user_metadata?.picture === "string"
              ? match.user_metadata.picture
              : "",
        authProvider: match.app_metadata?.provider === "google" ? "google" : "supabase",
        referralCode: typeof match.user_metadata?.referralCode === "string" ? match.user_metadata.referralCode : "",
        referredBy: typeof match.user_metadata?.referredBy === "string" ? match.user_metadata.referredBy : "",
        referralCount: Number(match.user_metadata?.referralCount || 0),
        score: Number(match.user_metadata?.score || 0),
        problemsSolved: 0,
        solvedProblems: [],
        badges: [],
        submissions: [],
        heatmapData: {},
        createdAt: match.created_at,
        lastLoginAt: match.last_sign_in_at,
      };
    }

    if (data.users.length < perPage) break;
    page += 1;
  }

  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  try {
    await connectToDatabase();

    // Use a case-insensitive search for username
    const user = await User.findOne({
      username: { $regex: new RegExp(`^${escapeRegex(username)}$`, "i") },
    }).select("-password");

    if (!user) {
      const supabaseUser = await findSupabaseProfile(username);
      if (!supabaseUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, user: supabaseUser });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Profile user lookup error:", error);
    try {
      const supabaseUser = await findSupabaseProfile(username);
      if (supabaseUser) {
        return NextResponse.json({ success: true, user: supabaseUser });
      }
    } catch (supabaseError) {
      console.error("Supabase profile fallback error:", supabaseError);
    }

    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
