/**
 * Authentication and JWT utilities
 */

import jwt, { JwtPayload, type SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * Create JWT token
 */
export function createToken(payload: object, expiresIn: SignOptions["expiresIn"] = "7d"): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not configured");
    return jwt.verify(token, secret) as JwtPayload;
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
    sub: userId,
    username,
    iat: Math.floor(Date.now() / 1000),
  };
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
