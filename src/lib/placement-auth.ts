import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

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
    const payload = verifyToken(token) as { userId?: string; sub?: string } | null;
    return payload?.userId || payload?.sub || null;
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Authentication required" }, { status: 401 });
}
