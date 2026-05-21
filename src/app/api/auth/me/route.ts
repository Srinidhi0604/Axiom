import { NextResponse } from "next/server";
import connectToDatabase, { isDatabaseConfigured } from "@/lib/mongodb";
import { getTokenFromCookies, publicUser, verifyToken } from "@/lib/auth";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = bearer || await getTokenFromCookies();
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await connectToDatabase();

    const payload = verifyToken(token);
    const userId = payload?.userId || payload?.sub;
    if (!userId) return NextResponse.json({ user: null }, { status: 200 });

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ user: null }, { status: 200 });

    return NextResponse.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
