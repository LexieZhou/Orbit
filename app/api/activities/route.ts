import { NextResponse } from "next/server";
import { getActivitiesWithPeople, MOCK_PEOPLE } from "@/lib/mock-data";
import { z } from "zod";

const CreateActivitySchema = z.object({
  personId: z.string(),
  activityType: z.enum(["coffee", "dinner", "chat", "call", "work_meeting", "trip", "date", "event"]),
  date: z.string().datetime(),
  locationName: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  mood: z.enum(["happy", "relaxed", "neutral", "awkward", "tired", "conflict"]),
  initiatedBy: z.enum(["me", "them", "mutual"]),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const personId = searchParams.get("personId");
  const limit = parseInt(searchParams.get("limit") ?? "200", 10);

  let activities = getActivitiesWithPeople();
  if (personId) {
    activities = activities.filter((a) => a.personId === personId);
  }

  return NextResponse.json(activities.slice(0, limit));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = CreateActivitySchema.parse(body);

    const person = MOCK_PEOPLE.find((p) => p.id === data.personId);
    if (!person) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    const newActivity = {
      id: `act-${Date.now()}`,
      personId: data.personId,
      activityType: data.activityType,
      date: new Date(data.date),
      locationName: data.locationName ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      mood: data.mood,
      initiatedBy: data.initiatedBy,
      notes: data.notes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      person,
    };

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}
