import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getUserIdFromRequest, unauthorized } from "@/lib/placement-auth";
import PlacementProgress from "@/models/PlacementProgress";

export async function GET(request: Request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return unauthorized();

  await connectToDatabase();
  const progress = await PlacementProgress.findOne({ userId }).lean();

  return NextResponse.json({
    solvedProblems: progress?.solvedProblems ?? [],
    notesMap: progress?.notesMap ?? {},
    lastUpdated: progress?.lastUpdated ?? null,
  });
}
