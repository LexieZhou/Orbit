import { NextResponse } from "next/server";
import { getActivityById, patchActivity } from "@/lib/mock-data";
import { z } from "zod";

export const dynamic = "force-dynamic";

const PatchSchema = z.object({
  activityType: z.enum(["coffee", "dinner", "chat", "call", "work_meeting", "trip", "date", "event"]).optional(),
  date: z.string().datetime().optional(),
  locationName: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  mood: z.enum(["happy", "relaxed", "neutral", "awkward", "tired", "conflict"]).optional(),
  initiatedBy: z.enum(["me", "them", "mutual"]).optional(),
  notes: z.string().nullable().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const activity = getActivityById(params.id);
  if (!activity) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(activity);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const patch = PatchSchema.parse(body);

    const updated = patchActivity(params.id, {
      ...patch,
      date: patch.date ? new Date(patch.date) : undefined,
    });

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
