import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { createSessionToken, publicUser, setAuthCookie } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import User from "@/models/User";

function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40);
}

function usernameFromSupabase(email: string, id: string, name?: string | null) {
  const base = normalizeUsername(name || email.split("@")[0] || "axiom_user") || "axiom_user";
  return `${base}_${id.slice(-6).toLowerCase()}`.slice(0, 40);
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const body = await request.json().catch(() => ({}));
    const accessToken = bearer || body?.accessToken;

    if (!accessToken || typeof accessToken !== "string") {
      return NextResponse.json({ error: "Missing Supabase access token" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user?.email) {
      return NextResponse.json({ error: "Invalid Supabase session" }, { status: 401 });
    }

    await connectToDatabase();

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

    let user = await User.findOne({
      $or: [{ email }, { supabaseId: supabaseUser.id }],
    });

    if (!user) {
      user = await User.create({
        username: usernameFromSupabase(email, supabaseUser.id, displayName),
        email,
        supabaseId: supabaseUser.id,
        avatarUrl,
        authProvider: provider,
        lastLoginAt: new Date(),
      });
    } else {
      user.supabaseId = user.supabaseId || supabaseUser.id;
      user.avatarUrl = avatarUrl || user.avatarUrl;
      user.authProvider = provider;
      user.lastLoginAt = new Date();
      await user.save();
    }

    const token = createSessionToken(user);
    const response = NextResponse.json({
      user: publicUser(user),
      token,
    });
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error("Supabase sync error:", error);
    return NextResponse.json({ error: "Failed to sync auth user" }, { status: 500 });
  }
}
