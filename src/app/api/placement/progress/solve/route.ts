import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getUserIdFromRequest, unauthorized } from "@/lib/placement-auth";
import PlacementProgress from "@/models/PlacementProgress";

export async function POST(request: Request) {
  const userId = getUserIdFromRequest(request) || "anonymous";

  const { slug, solved } = await request.json();
  if (!slug || typeof solved !== "boolean") {
    return NextResponse.json({ error: "slug and solved are required" }, { status: 400 });
  }

  await connectToDatabase();
  const update = solved
    ? { $addToSet: { solvedProblems: slug }, $set: { lastUpdated: new Date() } }
    : { $pull: { solvedProblems: slug }, $set: { lastUpdated: new Date() } };

  const progress = await PlacementProgress.findOneAndUpdate({ userId }, update, { new: true, upsert: true });
  return NextResponse.json({ solvedProblems: progress.solvedProblems });
}
