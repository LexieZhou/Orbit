import { NextResponse } from "next/server";
import { getPeopleWithInsights } from "@/lib/mock-data";
import { z } from "zod";

const CreatePersonSchema = z.object({
  name: z.string().min(1).max(100),
  relationshipType: z.enum(["friend", "family", "romantic", "coworker", "mentor", "other"]),
  notes: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET() {
  const people = getPeopleWithInsights();
  return NextResponse.json(people);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = CreatePersonSchema.parse(body);
    // In mock mode, return a new person object (not persisted)
    const newPerson = {
      id: `person-${Date.now()}`,
      name: data.name,
      relationshipType: data.relationshipType,
      notes: data.notes ?? null,
      avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(data.name)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      relationshipInsight: null,
      activities: [],
    };
    return NextResponse.json(newPerson, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create person" }, { status: 500 });
  }
}
