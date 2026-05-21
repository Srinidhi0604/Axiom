import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { createSessionToken, publicUser, setAuthCookie } from "@/lib/auth";
import User from "@/models/User";

type GoogleTokenResponse = {
  access_token?: string;
  id_token?: string;
  error?: string;
};

type GoogleProfile = {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

function getBaseUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || request.nextUrl.origin;
}

function usernameFromProfile(profile: GoogleProfile) {
  const base = (profile.name || profile.email.split("@")[0])
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 28) || "axiom_user";
  return `${base}_${profile.sub.slice(-6).toLowerCase()}`;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get("axiom_oauth_state")?.value;
  const next = request.cookies.get("axiom_oauth_next")?.value || "/";

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL("/auth/login?error=oauth_state", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/auth/login?error=oauth_config", request.url));
  }

  try {
    const redirectUri = `${getBaseUrl(request)}/api/auth/callback`;
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;
    if (!tokenResponse.ok || tokenData.error || !tokenData.access_token) {
      throw new Error(tokenData.error || "Google token exchange failed");
    }

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = (await profileResponse.json()) as GoogleProfile;
    if (!profileResponse.ok || !profile.email || !profile.sub) {
      throw new Error("Google profile fetch failed");
    }

    await connectToDatabase();
    const email = profile.email.toLowerCase().trim();
    let user = await User.findOne({ $or: [{ email }, { googleId: profile.sub }] });

    if (!user) {
      user = await User.create({
        username: usernameFromProfile(profile),
        email,
        googleId: profile.sub,
        avatarUrl: profile.picture ?? "",
        authProvider: "google",
        lastLoginAt: new Date(),
      });
    } else {
      user.googleId = user.googleId || profile.sub;
      user.avatarUrl = profile.picture || user.avatarUrl;
      user.authProvider = user.authProvider || "google";
      user.lastLoginAt = new Date();
      await user.save();
    }

    const token = createSessionToken(user);
    const response = NextResponse.redirect(new URL(next, request.url));
    setAuthCookie(response, token);
    response.cookies.set("axiom_oauth_state", "", { path: "/", maxAge: 0 });
    response.cookies.set("axiom_oauth_next", "", { path: "/", maxAge: 0 });
    return response;
  } catch (error) {
    console.error("Google auth callback error:", error);
    return NextResponse.redirect(new URL("/auth/login?error=oauth_failed", request.url));
  }
}
