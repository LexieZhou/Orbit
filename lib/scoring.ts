/**
 * Closeness Score Algorithm
 * 
 * Produces a score from 0–100 representing the current strength of a relationship.
 * 
 * Formula:
 *   closenessScore = recencyScore × 0.35
 *                  + frequencyScore × 0.30
 *                  + moodScore × 0.20
 *                  + initiativeScore × 0.15
 * 
 * Each component returns a value 0–100 before weighting.
 */

import type { Activity, Mood } from "@prisma/client";
import { differenceInDays, subDays } from "date-fns";

const WEIGHTS = {
  recency: 0.35,
  frequency: 0.30,
  mood: 0.20,
  initiative: 0.15,
};

// Mood impact: how much each mood contributes to the score
const MOOD_SCORES: Record<Mood, number> = {
  happy: 100,
  relaxed: 85,
  neutral: 60,
  awkward: 35,
  tired: 45,
  conflict: 10,
};

/**
 * Recency score — decays exponentially with time since last interaction.
 * Score is 100 for interactions today, ~50 at 30 days, ~0 at 90+ days.
 */
function recencyScore(activities: Activity[]): number {
  if (activities.length === 0) return 0;
  const lastDate = activities.reduce((latest, a) => 
    a.date > latest ? a.date : latest, activities[0].date);
  const days = differenceInDays(new Date(), lastDate);
  // Exponential decay: score = 100 * e^(-days / 40)
  return 100 * Math.exp(-days / 40);
}

/**
 * Frequency score — based on interaction counts in last 30 and 90 days.
 * Regular weekly contact = 100; monthly contact ≈ 50; rare ≈ 0.
 */
function frequencyScore(activities: Activity[]): number {
  const now = new Date();
  const count30 = activities.filter(
    (a) => differenceInDays(now, a.date) <= 30
  ).length;
  const count90 = activities.filter(
    (a) => differenceInDays(now, a.date) <= 90
  ).length;

  // Weight recent interactions more
  const weighted = count30 * 3 + count90;
  // Normalize: 12 recent interactions (e.g. 4/week × 3) = perfect score
  return Math.min(100, (weighted / 12) * 100);
}

/**
 * Mood score — weighted average of mood scores across recent activities.
 * Positive moods push score up; conflict drags it down.
 */
function moodScore(activities: Activity[]): number {
  if (activities.length === 0) return 50; // neutral baseline

  // Consider only the last 10 activities for mood assessment
  const recent = [...activities]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  const total = recent.reduce((sum, a) => sum + MOOD_SCORES[a.mood], 0);
  return total / recent.length;
}

/**
 * Initiative score — rewards balanced reciprocity.
 * Imbalanced patterns (all me or all them) score lower than mutual.
 */
function initiativeScore(activities: Activity[]): number {
  if (activities.length === 0) return 50;

  const counts = { me: 0, them: 0, mutual: 0 };
  activities.forEach((a) => {
    if (a.initiatedBy === "me") counts.me++;
    else if (a.initiatedBy === "them") counts.them++;
    else counts.mutual++;
  });

  const total = activities.length;
  // Mutual interactions get the most weight
  const mutualRatio = (counts.mutual + Math.min(counts.me, counts.them)) / total;
  // Perfect reciprocity scores 100, one-sided interaction scores ~50
  return 50 + mutualRatio * 50;
}

/**
 * Compute closeness score for a person based on their activity history.
 */
export function computeClosenessScore(activities: Activity[]): number {
  const r = recencyScore(activities);
  const f = frequencyScore(activities);
  const m = moodScore(activities);
  const i = initiativeScore(activities);

  const score =
    r * WEIGHTS.recency +
    f * WEIGHTS.frequency +
    m * WEIGHTS.mood +
    i * WEIGHTS.initiative;

  return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * Determine relationship trend direction.
 * Compares interaction density in last 30 days vs. 31–90 days.
 */
export function computeTrendDirection(
  activities: Activity[]
): "up" | "steady" | "down" {
  const now = new Date();
  const recent = activities.filter(
    (a) => differenceInDays(now, a.date) <= 30
  ).length;
  const older = activities.filter((a) => {
    const days = differenceInDays(now, a.date);
    return days > 30 && days <= 90;
  }).length;

  // Normalize older count to same period length (30 days vs 60 days → divide by 2)
  const olderMonthly = older / 2;

  if (recent > olderMonthly * 1.3) return "up";
  if (recent < olderMonthly * 0.6) return "down";
  return "steady";
}

/**
 * Compute initiative balance: positive = I initiate more, negative = they do.
 * Returns value from -1 to +1.
 */
export function computeInitiativeBalance(activities: Activity[]): number {
  if (activities.length === 0) return 0;
  const me = activities.filter((a) => a.initiatedBy === "me").length;
  const them = activities.filter((a) => a.initiatedBy === "them").length;
  const mutual = activities.filter((a) => a.initiatedBy === "mutual").length;
  
  const total = me + them + mutual;
  if (total === 0) return 0;
  // Mutual counts as 0.5 for each side
  const myInitiative = me + mutual * 0.5;
  const theirInitiative = them + mutual * 0.5;
  return (myInitiative - theirInitiative) / total;
}

/**
 * Determine the dominant mood from a list of activities.
 */
export function computeDominantMood(activities: Activity[]): Mood | null {
  if (activities.length === 0) return null;
  const counts = {} as Record<Mood, number>;
  activities.forEach((a) => {
    counts[a.mood] = (counts[a.mood] || 0) + 1;
  });
  return Object.entries(counts).sort(([, a], [, b]) => b - a)[0][0] as Mood;
}

/**
 * Compute the next suggested reminder date for a person.
 * Returns null if no reminder is needed soon.
 */
export function computeNextReminderAt(
  activities: Activity[],
  trendDirection: string
): Date | null {
  if (activities.length === 0) return new Date(); // Immediate reminder for new people

  const now = new Date();
  const lastActivity = activities.reduce((latest, a) =>
    a.date > latest.date ? a : latest
  );
  const daysSinceLast = differenceInDays(now, lastActivity.date);

  // Reminder thresholds based on relationship health
  if (trendDirection === "down" && daysSinceLast >= 21) {
    return subDays(now, -1); // Remind tomorrow
  }
  if (daysSinceLast >= 45) {
    return subDays(now, -3); // Remind in 3 days
  }
  if (daysSinceLast >= 30) {
    return subDays(now, -7); // Remind in a week
  }
  return null;
}

/**
 * Build a historical closeness trend for charting.
 * Returns an array of {date, score} points over the past 6 months.
 */
export function buildClosenessTimeline(
  activities: Activity[]
): { date: string; score: number }[] {
  const points: { date: string; score: number }[] = [];
  const now = new Date();

  // Sample every 2 weeks going back 6 months (13 points)
  for (let weeksBack = 24; weeksBack >= 0; weeksBack -= 2) {
    const snapshotDate = subDays(now, weeksBack * 7);
    // Only count activities before this snapshot date
    const activitiesAtSnapshot = activities.filter(
      (a) => a.date <= snapshotDate
    );
    const score = computeClosenessScore(activitiesAtSnapshot);
    points.push({
      date: snapshotDate.toISOString().split("T")[0],
      score,
    });
  }

  return points;
}
