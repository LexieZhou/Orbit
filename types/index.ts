import type {
  Person as PrismaPerson,
  Activity as PrismaActivity,
  RelationshipInsight as PrismaInsight,
  RelationshipType,
  ActivityType,
  Mood,
  InitiatedBy,
  TrendDirection,
} from "@prisma/client";

// Re-export Prisma enums for convenience
export type { RelationshipType, ActivityType, Mood, InitiatedBy, TrendDirection };

// ── Extended types with relations ─────────────────────────────────────────────

export type PersonWithInsight = PrismaPerson & {
  relationshipInsight: PrismaInsight | null;
  activities?: PrismaActivity[];
};

export type ActivityWithPerson = PrismaActivity & {
  person: PrismaPerson;
};

// ── API response types ─────────────────────────────────────────────────────────

export interface DashboardStats {
  totalPeople: number;
  totalActivities: number;
  activitiesThisMonth: number;
  averageCloseness: number;
}

export interface ReminderItem {
  personId: string;
  personName: string;
  avatarUrl: string | null;
  message: string;
  priority: "high" | "medium" | "low";
  type: "reconnect" | "reciprocity" | "fading" | "memory";
  daysSinceLastInteraction: number;
}

export interface InsightSummary {
  personId: string;
  closenessScore: number;
  trendDirection: TrendDirection;
  trendLabel: string;
  interactionCount30d: number;
  interactionCount90d: number;
  dominantMood: Mood | null;
  initiativeBalance: number;
  lastInteractionDate: string | null;
  daysSinceLastInteraction: number | null;
}

// ── Form types ─────────────────────────────────────────────────────────────────

export interface ActivityFormValues {
  personId: string;
  activityType: ActivityType;
  date: Date;
  locationName: string;
  latitude?: number;
  longitude?: number;
  mood: Mood;
  initiatedBy: InitiatedBy;
  notes: string;
}

export interface PersonFormValues {
  name: string;
  relationshipType: RelationshipType;
  notes: string;
  avatarUrl?: string;
}

// ── Map types ─────────────────────────────────────────────────────────────────

export interface MapMarkerData {
  id: string;
  latitude: number;
  longitude: number;
  locationName: string;
  activities: ActivityWithPerson[];
}

// ── Graph types ───────────────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  label: string;
  type: "user" | "person";
  relationshipType?: RelationshipType;
  closenessScore?: number;
  avatarUrl?: string | null;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number; // 0–1, maps to visual thickness
  trendDirection: TrendDirection;
}

// ── Trend types ───────────────────────────────────────────────────────────────

export interface InteractionDataPoint {
  week: string;  // "YYYY-WW"
  date: string;  // ISO date of week start
  count: number;
}

export interface MoodDataPoint {
  month: string;
  happy: number;
  relaxed: number;
  neutral: number;
  awkward: number;
  tired: number;
  conflict: number;
}

export interface ClosenessDataPoint {
  date: string;
  score: number;
}

// ── UI helpers ────────────────────────────────────────────────────────────────

export const MOOD_LABELS: Record<Mood, string> = {
  happy: "Happy",
  relaxed: "Relaxed",
  neutral: "Neutral",
  awkward: "Awkward",
  tired: "Tired",
  conflict: "Conflict",
};

export const MOOD_COLORS: Record<Mood, string> = {
  happy: "#f59e0b",
  relaxed: "#10b981",
  neutral: "#94a3b8",
  awkward: "#f97316",
  tired: "#8b5cf6",
  conflict: "#ef4444",
};

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  coffee: "Coffee",
  dinner: "Dinner",
  chat: "Chat",
  call: "Call",
  work_meeting: "Work Meeting",
  trip: "Trip",
  date: "Date",
  event: "Event",
};

export const ACTIVITY_ICONS: Record<ActivityType, string> = {
  coffee: "☕",
  dinner: "🍽️",
  chat: "💬",
  call: "📞",
  work_meeting: "💼",
  trip: "✈️",
  date: "🌹",
  event: "🎉",
};

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  friend: "Friend",
  family: "Family",
  romantic: "Romantic",
  coworker: "Coworker",
  mentor: "Mentor",
  other: "Other",
};

export const RELATIONSHIP_COLORS: Record<RelationshipType, string> = {
  friend: "#3b82f6",
  family: "#8b5cf6",
  romantic: "#ec4899",
  coworker: "#f59e0b",
  mentor: "#10b981",
  other: "#94a3b8",
};
