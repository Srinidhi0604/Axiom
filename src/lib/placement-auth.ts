import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export function getUserIdFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const cookieToken = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("token="))
    ?.slice(6);
  const token = bearer || cookieToken;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId?: string; sub?: string };
    return payload.userId || payload.sub || null;
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Authentication required" }, { status: 401 });
}
