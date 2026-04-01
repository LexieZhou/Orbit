/**
 * Reminder Logic
 * 
 * Analyzes a person's activity history and relationship insights to generate
 * smart, context-aware reminder messages.
 * 
 * Rules:
 * 1. Long absence: no interaction for X days → reconnect suggestion
 * 2. Fading relationship: was active, now declining → high-priority alert
 * 3. Reciprocity gap: other person initiates much more → reciprocity nudge
 * 4. Place memory: has meaningful shared locations → use in reminder copy
 * 5. Positive but declining: mostly positive moods but falling frequency → gentle prompt
 */

import type { Activity, Person, RelationshipInsight } from "@prisma/client";
import { differenceInDays } from "date-fns";
import type { ReminderItem } from "@/types";

const RECONNECT_THRESHOLD_DAYS = {
  romantic: 5,
  family: 14,
  friend: 21,
  mentor: 30,
  coworker: 30,
  other: 45,
};

function getTopLocation(activities: Activity[]): string | null {
  const locationCounts: Record<string, number> = {};
  activities.forEach((a) => {
    if (a.locationName) {
      locationCounts[a.locationName] = (locationCounts[a.locationName] || 0) + 1;
    }
  });
  const sorted = Object.entries(locationCounts).sort(([, a], [, b]) => b - a);
  return sorted.length > 0 ? sorted[0][0] : null;
}

function daysSinceLastInteraction(activities: Activity[]): number | null {
  if (activities.length === 0) return null;
  const last = activities.reduce((latest, a) =>
    a.date > latest.date ? a : latest
  );
  return differenceInDays(new Date(), last.date);
}

export function generateReminders(
  people: (Person & {
    activities: Activity[];
    relationshipInsight: RelationshipInsight | null;
  })[]
): ReminderItem[] {
  const reminders: ReminderItem[] = [];

  for (const person of people) {
    const { activities, relationshipInsight: insight } = person;
    const days = daysSinceLastInteraction(activities);
    const threshold =
      RECONNECT_THRESHOLD_DAYS[person.relationshipType] ?? 30;
    const topLocation = getTopLocation(activities);

    // ── Rule 1: Long absence ────────────────────────────────────────────────
    if (days !== null && days >= threshold) {
      const locationClue =
        topLocation && activities.length >= 3
          ? ` You often used to meet around ${topLocation}.`
          : "";

      const daysLabel =
        days === 1 ? "1 day" : days < 60 ? `${days} days` : `${Math.round(days / 30)} months`;

      reminders.push({
        personId: person.id,
        personName: person.name,
        avatarUrl: person.avatarUrl,
        message: `You haven't connected with ${person.name} in ${daysLabel}.${locationClue} It might be a good time to reach out.`,
        priority: days >= threshold * 2 ? "high" : "medium",
        type: "reconnect",
        daysSinceLastInteraction: days,
      });
      continue; // Only one reminder per person for now
    }

    // ── Rule 2: Fading relationship ─────────────────────────────────────────
    if (insight?.trendDirection === "down" && days !== null && days >= 14) {
      reminders.push({
        personId: person.id,
        personName: person.name,
        avatarUrl: person.avatarUrl,
        message: `Your connection with ${person.name} has been getting less frequent lately. Don't let it fade — you used to be in regular touch.`,
        priority: "high",
        type: "fading",
        daysSinceLastInteraction: days,
      });
      continue;
    }

    // ── Rule 3: Reciprocity gap (they initiate much more) ───────────────────
    if (insight && insight.initiativeBalance < -0.4 && days !== null && days >= 10) {
      reminders.push({
        personId: person.id,
        personName: person.name,
        avatarUrl: person.avatarUrl,
        message: `${person.name} tends to reach out more than you do. Consider being the one to initiate next time.`,
        priority: "medium",
        type: "reciprocity",
        daysSinceLastInteraction: days,
      });
      continue;
    }

    // ── Rule 4: Positive but slowing ────────────────────────────────────────
    const positiveMoods = ["happy", "relaxed"];
    const recentPositive = activities
      .filter((a) => {
        const d = differenceInDays(new Date(), a.date);
        return d <= 90 && positiveMoods.includes(a.mood);
      })
      .length;
    const recentTotal = activities.filter(
      (a) => differenceInDays(new Date(), a.date) <= 90
    ).length;

    if (
      recentTotal >= 2 &&
      recentPositive / recentTotal >= 0.7 &&
      days !== null &&
      days >= threshold * 0.8
    ) {
      const locationClue =
        topLocation ? ` Maybe revisit ${topLocation}?` : "";

      reminders.push({
        personId: person.id,
        personName: person.name,
        avatarUrl: person.avatarUrl,
        message: `Your time with ${person.name} is always positive. You're due for another catch-up.${locationClue}`,
        priority: "low",
        type: "memory",
        daysSinceLastInteraction: days,
      });
    }
  }

  // Sort: high → medium → low, then by days since interaction descending
  return reminders.sort((a, b) => {
    const pOrder = { high: 0, medium: 1, low: 2 };
    if (pOrder[a.priority] !== pOrder[b.priority]) {
      return pOrder[a.priority] - pOrder[b.priority];
    }
    return (b.daysSinceLastInteraction ?? 0) - (a.daysSinceLastInteraction ?? 0);
  });
}
