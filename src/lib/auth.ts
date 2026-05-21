/**
 * Authentication and JWT utilities
 */

import { cookies } from "next/headers";
import jwt, { JwtPayload, type SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * Create JWT token
 */
export function createToken(payload: object, expiresIn: SignOptions["expiresIn"] = "7d"): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare password with hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  return parts[1];
}

/**
 * Generate session token payload
 */
export function generateSessionPayload(userId: string, username: string) {
  return {
    userId,
    sub: userId,
    username,
    iat: Math.floor(Date.now() / 1000),
  };
}

export const AUTH_COOKIE = "axiom_token";
export const AUTH_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function getJwtSecret() {
  const secret =
    process.env.JWT_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!secret || secret.length < 32) {
    throw new Error("Axiom session signing secret is not configured");
  }
  return secret;
}

export function createSessionToken(user: { _id: unknown; username: string; email: string }) {
  return jwt.sign(
    {
      userId: String(user._id),
      sub: String(user._id),
      username: user.username,
      email: user.email,
    },
    getJwtSecret(),
    { expiresIn: "7d" },
  );
}

export function publicUser(user: {
  _id: unknown;
  username: string;
  email: string;
  avatarUrl?: string;
  authProvider?: string;
  referralCode?: string;
  referredBy?: string;
  referralCount?: number;
  score?: number;
}) {
  return {
    id: String(user._id),
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl ?? "",
    authProvider: user.authProvider ?? "password",
    referralCode: user.referralCode ?? "",
    referredBy: user.referredBy ?? "",
    referralCount: user.referralCount ?? 0,
    score: user.score ?? 0,
  };
}

export async function getTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value ?? cookieStore.get("token")?.value ?? null;
}

export function setAuthCookie(response: Response & { cookies?: { set: (...args: any[]) => void } }, token: string) {
  response.cookies?.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_MAX_AGE_SECONDS,
  });
  response.cookies?.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_MAX_AGE_SECONDS,
  });
}

export function clearAuthCookie(response: Response & { cookies?: { set: (...args: any[]) => void } }) {
  for (const name of [AUTH_COOKIE, "token"]) {
    response.cookies?.set(name, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }
}

/**
 * Validate token format and structure
 */
export function isValidTokenFormat(token: string): boolean {
  const parts = token.split(".");
  return parts.length === 3;
}

/**
 * Get token expiration time
 */
export function getTokenExpiration(token: string): Date | null {
  const payload = verifyToken(token);
  if (!payload || !payload.exp) return null;
  return new Date(payload.exp * 1000);
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  return expiration < new Date();
}

/**
 * Validate password strength requirements
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Safe token verification with error handling
 */
export function safeVerifyToken(token: string): JwtPayload | null {
  try {
    if (!isValidTokenFormat(token)) {
      return null;
    }
    return verifyToken(token);
  } catch {
    return null;
  }
}
