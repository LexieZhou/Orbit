export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getPeopleWithInsights, MOCK_ACTIVITIES } from "@/lib/mock-data";
import { generateReminders } from "@/lib/reminders";
import { buildClosenessTimeline } from "@/lib/scoring";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "summary";

  if (type === "reminders") {
    const people = getPeopleWithInsights();
    const reminders = generateReminders(people);
    return NextResponse.json(reminders);
  }

  if (type === "timeline") {
    const personId = searchParams.get("personId");
    if (!personId) {
      return NextResponse.json({ error: "personId required" }, { status: 400 });
    }
    const activities = MOCK_ACTIVITIES.filter((a) => a.personId === personId);
    const timeline = buildClosenessTimeline(activities);
    return NextResponse.json(timeline);
  }

  const people = getPeopleWithInsights();
  return NextResponse.json(people.map((p) => ({
    ...p.relationshipInsight,
    person: { id: p.id, name: p.name, avatarUrl: p.avatarUrl },
  })));
}
