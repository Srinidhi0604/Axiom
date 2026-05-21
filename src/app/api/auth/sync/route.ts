import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { createSessionToken, publicUser, setAuthCookie } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import User from "@/models/User";

type SupabaseLikeUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40);
}

function usernameFromSupabase(email: string, id: string, name?: string | null) {
  const base = normalizeUsername(name || email.split("@")[0] || "axiom_user") || "axiom_user";
  return `${base}_${id.slice(-6).toLowerCase()}`.slice(0, 40);
}

function makeReferralCode(username: string, idOrEmail: string) {
  const base = normalizeUsername(username).replace(/_/g, "").toUpperCase().slice(0, 8) || "AXIOM";
  const suffix = idOrEmail.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase() || Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${base}${suffix}`;
}

function supabaseOnlyUser(supabaseUser: SupabaseLikeUser) {
  const email = (supabaseUser.email || "").toLowerCase().trim();
  const displayName =
    typeof supabaseUser.user_metadata?.full_name === "string"
      ? supabaseUser.user_metadata.full_name
      : typeof supabaseUser.user_metadata?.name === "string"
        ? supabaseUser.user_metadata.name
        : null;
  const avatarUrl =
    typeof supabaseUser.user_metadata?.avatar_url === "string"
      ? supabaseUser.user_metadata.avatar_url
      : typeof supabaseUser.user_metadata?.picture === "string"
        ? supabaseUser.user_metadata.picture
        : "";

  return {
    _id: supabaseUser.id,
    username: usernameFromSupabase(email, supabaseUser.id, displayName),
    email,
    avatarUrl,
    authProvider: supabaseUser.app_metadata?.provider === "google" ? "google" : "supabase",
    referralCode:
      typeof supabaseUser.user_metadata?.referralCode === "string"
        ? supabaseUser.user_metadata.referralCode
        : makeReferralCode(usernameFromSupabase(email, supabaseUser.id, displayName), supabaseUser.id),
    referredBy: typeof supabaseUser.user_metadata?.referredBy === "string" ? supabaseUser.user_metadata.referredBy : "",
    referralCount: Number(supabaseUser.user_metadata?.referralCount || 0),
    score: Number(supabaseUser.user_metadata?.score || 0),
  };
}

function decodeSupabaseAccessToken(accessToken: string): SupabaseLikeUser | null {
  try {
    const [, payload] = accessToken.split(".");
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(Buffer.from(normalized, "base64").toString("utf8"));
    const email = typeof decoded.email === "string" ? decoded.email : "";
    const id = typeof decoded.sub === "string" ? decoded.sub : "";

    if (!id || !email) return null;

    return {
      id,
      email,
      app_metadata: typeof decoded.app_metadata === "object" && decoded.app_metadata ? decoded.app_metadata : {},
      user_metadata: typeof decoded.user_metadata === "object" && decoded.user_metadata ? decoded.user_metadata : {},
    };
  } catch {
    return null;
  }
}

function completeAuth(user: { _id: unknown; username: string; email: string; avatarUrl?: string; authProvider?: string }) {
  const token = createSessionToken(user);
  const response = NextResponse.json({
    user: publicUser(user),
    token,
  });
  setAuthCookie(response, token);
  return response;
}

export async function POST(request: Request) {
  let accessToken: string | null = null;

  try {
    const authHeader = request.headers.get("authorization");
    const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const body = await request.json().catch(() => ({}));
    accessToken = bearer || body?.accessToken;

    if (!accessToken || typeof accessToken !== "string") {
      return NextResponse.json({ error: "Missing Supabase access token" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user?.email) {
      return NextResponse.json(
        { error: "Invalid Supabase session", details: error?.message },
        { status: 401 },
      );
    }

    const supabaseUser = data.user;
    const email = (supabaseUser.email || "").toLowerCase().trim();
    const provider = supabaseUser.app_metadata?.provider === "google" ? "google" : "supabase";
    const avatarUrl = typeof supabaseUser.user_metadata?.avatar_url === "string"
      ? supabaseUser.user_metadata.avatar_url
      : typeof supabaseUser.user_metadata?.picture === "string"
        ? supabaseUser.user_metadata.picture
        : "";
    const displayName = typeof supabaseUser.user_metadata?.full_name === "string"
      ? supabaseUser.user_metadata.full_name
      : typeof supabaseUser.user_metadata?.name === "string"
        ? supabaseUser.user_metadata.name
        : null;

    let user;

    try {
      await connectToDatabase();

      user = await User.findOne({
        $or: [{ email }, { supabaseId: supabaseUser.id }],
      });

      if (!user) {
        try {
          user = await User.create({
            username: usernameFromSupabase(email, supabaseUser.id, displayName),
            email,
            supabaseId: supabaseUser.id,
            avatarUrl,
            authProvider: provider,
            referralCode: makeReferralCode(usernameFromSupabase(email, supabaseUser.id, displayName), supabaseUser.id),
            lastLoginAt: new Date(),
          });
        } catch (createError: any) {
          if (createError?.code !== 11000) {
            throw createError;
          }

          user = await User.findOne({
            $or: [{ email }, { supabaseId: supabaseUser.id }],
          });
          if (!user) throw createError;
        }
      }

      user.supabaseId = user.supabaseId || supabaseUser.id;
      user.avatarUrl = avatarUrl || user.avatarUrl;
      user.authProvider = provider;
      user.referralCode = user.referralCode || makeReferralCode(user.username, String(user._id));
      user.lastLoginAt = new Date();
      await user.save();
    } catch (databaseError) {
      console.error("Supabase Mongo sync skipped:", databaseError);
      user = supabaseOnlyUser(supabaseUser);
    }

    return completeAuth(user);
  } catch (error) {
    console.error("Supabase sync error:", error);

    if (accessToken) {
      const decodedUser = decodeSupabaseAccessToken(accessToken);
      if (decodedUser) {
        try {
          return completeAuth(supabaseOnlyUser(decodedUser));
        } catch (fallbackError) {
          console.error("Supabase token fallback failed:", fallbackError);
        }
      }
    }

    return NextResponse.json({ error: "Failed to sync auth user" }, { status: 500 });
  }
}
