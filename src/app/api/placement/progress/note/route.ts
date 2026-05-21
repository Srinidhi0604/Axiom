import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getUserIdFromRequest, unauthorized } from "@/lib/placement-auth";
import PlacementProgress from "@/models/PlacementProgress";

export async function POST(request: Request) {
  const userId = getUserIdFromRequest(request) || "anonymous";

  const { slug, note } = await request.json();
  if (!slug || typeof note !== "string") {
    return NextResponse.json({ error: "slug and note are required" }, { status: 400 });
  }

  await connectToDatabase();
  const progress = await PlacementProgress.findOneAndUpdate(
    { userId },
    { $set: { [`notesMap.${slug}`]: note, lastUpdated: new Date() } },
    { new: true, upsert: true }
  );

  return NextResponse.json({ notesMap: Object.fromEntries(progress.notesMap ?? []) });
}
