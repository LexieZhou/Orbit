/**
 * Static mock data — no database required.
 * The app uses this data directly when DATABASE_URL is not configured
 * or when running in demo mode.
 */

import type {
  Person,
  Activity,
  RelationshipInsight,
  RelationshipType,
  ActivityType,
  Mood,
  InitiatedBy,
  TrendDirection,
} from "@prisma/client";
import { subDays, subHours } from "date-fns";

const now = new Date();
const d = (days: number, hours = 0) => subHours(subDays(now, days), hours);

// ── People ────────────────────────────────────────────────────────────────────

export const MOCK_PEOPLE: Person[] = [
  {
    id: "person-sarah",
    name: "Sarah Chen",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Sarah",
    relationshipType: "friend" as RelationshipType,
    notes: "Met at a design meetup in 2021. She works at a startup in SoHo. Always down for coffee chats about life and creativity.",
    createdAt: d(200),
    updatedAt: d(3),
  },
  {
    id: "person-marcus",
    name: "Marcus Williams",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Marcus",
    relationshipType: "coworker" as RelationshipType,
    notes: "Senior engineer on the platform team. We bonded over a shared interest in distributed systems and good espresso.",
    createdAt: d(180),
    updatedAt: d(2),
  },
  {
    id: "person-yuki",
    name: "Yuki Tanaka",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Yuki",
    relationshipType: "friend" as RelationshipType,
    notes: "College friend, now living in SF. We stay close through visits and long calls. She always brings out the best in me.",
    createdAt: d(300),
    updatedAt: d(25),
  },
  {
    id: "person-david",
    name: "David Park",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=David",
    relationshipType: "mentor" as RelationshipType,
    notes: "My former manager. Incredibly wise. Monthly coffee check-ins have shaped how I think about my career.",
    createdAt: d(400),
    updatedAt: d(12),
  },
  {
    id: "person-elena",
    name: "Elena Rossi",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Elena",
    relationshipType: "romantic" as RelationshipType,
    notes: "Met through a mutual friend at a gallery opening. She's a photographer with an infectious sense of adventure.",
    createdAt: d(80),
    updatedAt: d(1),
  },
  {
    id: "person-tom",
    name: "Tom Nguyen",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Tom",
    relationshipType: "friend" as RelationshipType,
    notes: "Gym buddy turned close friend. We used to grab breakfast every Saturday but haven't caught up properly in a while.",
    createdAt: d(250),
    updatedAt: d(68),
  },
  {
    id: "person-priya",
    name: "Priya Sharma",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Priya",
    relationshipType: "coworker" as RelationshipType,
    notes: "Product manager I collaborated with on the mobile re-launch. Sharp thinker.",
    createdAt: d(200),
    updatedAt: d(85),
  },
  {
    id: "person-james",
    name: "James O'Brien",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=James",
    relationshipType: "family" as RelationshipType,
    notes: "My older brother. Lives in Brooklyn. We don't see each other as often as we should.",
    createdAt: d(500),
    updatedAt: d(42),
  },
];

// ── Activities ────────────────────────────────────────────────────────────────

export const MOCK_ACTIVITIES: Activity[] = [
  // Sarah Chen
  { id: "act-1",  personId: "person-sarah",  activityType: "coffee"       as ActivityType, date: d(3),   locationName: "La Colombe, Nolita",            latitude: 40.7223, longitude: -73.9969, mood: "happy"    as Mood, initiatedBy: "mutual" as InitiatedBy, notes: "Caught up over oat lattes. She's thinking about leaving her startup to go independent.", createdAt: d(3),   updatedAt: d(3)  },
  { id: "act-2",  personId: "person-sarah",  activityType: "dinner"       as ActivityType, date: d(18),  locationName: "Cervo's, Lower East Side",       latitude: 40.7197, longitude: -73.9889, mood: "happy"    as Mood, initiatedBy: "them"   as InitiatedBy, notes: "She picked this place – amazing Portuguese food. Ended up talking for 3 hours.",          createdAt: d(18),  updatedAt: d(18) },
  { id: "act-3",  personId: "person-sarah",  activityType: "event"        as ActivityType, date: d(35),  locationName: "MoMA, Midtown",                  latitude: 40.7614, longitude: -73.9776, mood: "relaxed"  as Mood, initiatedBy: "me"     as InitiatedBy, notes: "Saw the Matisse exhibit together. She knew so much about the work.",                      createdAt: d(35),  updatedAt: d(35) },
  { id: "act-4",  personId: "person-sarah",  activityType: "coffee"       as ActivityType, date: d(55),  locationName: "Intelligentsia, High Line",      latitude: 40.7480, longitude: -74.0048, mood: "relaxed"  as Mood, initiatedBy: "me"     as InitiatedBy, notes: "Quick afternoon coffee before she had a client call.", createdAt: d(55), updatedAt: d(55) },
  { id: "act-5",  personId: "person-sarah",  activityType: "chat"         as ActivityType, date: d(72),  locationName: "Washington Square Park",         latitude: 40.7308, longitude: -73.9973, mood: "happy"    as Mood, initiatedBy: "mutual" as InitiatedBy, notes: "Spontaneous walk and talk in the park.",                                                       createdAt: d(72),  updatedAt: d(72) },
  { id: "act-6",  personId: "person-sarah",  activityType: "dinner"       as ActivityType, date: d(95),  locationName: "Via Carota, West Village",       latitude: 40.7332, longitude: -74.0047, mood: "happy"    as Mood, initiatedBy: "them"   as InitiatedBy, notes: "Birthday dinner she organized. Perfect evening.",                                              createdAt: d(95),  updatedAt: d(95) },

  // Marcus Williams
  { id: "act-7",  personId: "person-marcus", activityType: "work_meeting" as ActivityType, date: d(2),   locationName: "Office, Hudson Yards",           latitude: 40.7538, longitude: -74.0004, mood: "neutral"  as Mood, initiatedBy: "them"   as InitiatedBy, notes: "Architecture review for the new pipeline.",                                                  createdAt: d(2),   updatedAt: d(2)  },
  { id: "act-8",  personId: "person-marcus", activityType: "coffee"       as ActivityType, date: d(9),   locationName: "Think Coffee, Midtown",          latitude: 40.7551, longitude: -73.9918, mood: "relaxed"  as Mood, initiatedBy: "me"     as InitiatedBy, notes: "Not work talk for once – chatted about side projects.",                                      createdAt: d(9),   updatedAt: d(9)  },
  { id: "act-9",  personId: "person-marcus", activityType: "work_meeting" as ActivityType, date: d(16),  locationName: "Office, Hudson Yards",           latitude: 40.7538, longitude: -74.0004, mood: "neutral"  as Mood, initiatedBy: "them"   as InitiatedBy, notes: "Sprint planning. A bit tense about the deadline.",                                           createdAt: d(16),  updatedAt: d(16) },
  { id: "act-10", personId: "person-marcus", activityType: "coffee"       as ActivityType, date: d(40),  locationName: "Blue Bottle, Williamsburg",      latitude: 40.7148, longitude: -73.9614, mood: "happy"    as Mood, initiatedBy: "mutual" as InitiatedBy, notes: "He recommended this spot. Good talk about career goals.",                                     createdAt: d(40),  updatedAt: d(40) },
  { id: "act-11", personId: "person-marcus", activityType: "work_meeting" as ActivityType, date: d(58),  locationName: "Office, Hudson Yards",           latitude: 40.7538, longitude: -74.0004, mood: "awkward"  as Mood, initiatedBy: "them"   as InitiatedBy, notes: "Post-incident debrief. Tension in the room.",                                               createdAt: d(58),  updatedAt: d(58) },

  // Yuki Tanaka
  { id: "act-12", personId: "person-yuki",   activityType: "trip"         as ActivityType, date: d(25),  locationName: "Ferry Building, San Francisco", latitude: 37.7955, longitude: -122.3937, mood: "happy"   as Mood, initiatedBy: "mutual" as InitiatedBy, notes: "Flew out to SF for the weekend. Explored the Farmers Market.",                              createdAt: d(25),  updatedAt: d(25) },
  { id: "act-13", personId: "person-yuki",   activityType: "dinner"       as ActivityType, date: d(26),  locationName: "Nopa, San Francisco",            latitude: 37.7762, longitude: -122.4304, mood: "happy"   as Mood, initiatedBy: "them"   as InitiatedBy, notes: "Late-night dinner at Nopa – she insisted on the whole roasted chicken.",                  createdAt: d(26),  updatedAt: d(26) },
  { id: "act-14", personId: "person-yuki",   activityType: "call"         as ActivityType, date: d(45),  locationName: null,                             latitude: null,    longitude: null,      mood: "relaxed" as Mood, initiatedBy: "me"     as InitiatedBy, notes: "Long video call to catch up. She's thinking about moving back east.",                      createdAt: d(45),  updatedAt: d(45) },
  { id: "act-15", personId: "person-yuki",   activityType: "call"         as ActivityType, date: d(78),  locationName: null,                             latitude: null,    longitude: null,      mood: "neutral" as Mood, initiatedBy: "them"   as InitiatedBy, notes: "She called to vent about work stuff. Listened mostly.",                                    createdAt: d(78),  updatedAt: d(78) },
  { id: "act-16", personId: "person-yuki",   activityType: "trip"         as ActivityType, date: d(120), locationName: "Golden Gate Park, SF",           latitude: 37.7694, longitude: -122.4862, mood: "happy"   as Mood, initiatedBy: "mutual" as InitiatedBy, notes: "Rented bikes and rode through the park. One of my favorite days.",                        createdAt: d(120), updatedAt: d(120)},

  // David Park
  { id: "act-17", personId: "person-david",  activityType: "coffee"       as ActivityType, date: d(12),  locationName: "Bluestone Lane, West Village",  latitude: 40.7348, longitude: -74.0065, mood: "relaxed"  as Mood, initiatedBy: "me"     as InitiatedBy, notes: "Monthly check-in. Talked through an offer I got.",                                        createdAt: d(12),  updatedAt: d(12) },
  { id: "act-18", personId: "person-david",  activityType: "coffee"       as ActivityType, date: d(45),  locationName: "Bluestone Lane, West Village",  latitude: 40.7348, longitude: -74.0065, mood: "relaxed"  as Mood, initiatedBy: "me"     as InitiatedBy, notes: "Perspective on navigating difficult stakeholders.",                                          createdAt: d(45),  updatedAt: d(45) },
  { id: "act-19", personId: "person-david",  activityType: "dinner"       as ActivityType, date: d(75),  locationName: "The NoMad, Flatiron",            latitude: 40.7444, longitude: -73.9887, mood: "happy"    as Mood, initiatedBy: "them"   as InitiatedBy, notes: "He invited me to a dinner with a few other people he mentors.",                           createdAt: d(75),  updatedAt: d(75) },
  { id: "act-20", personId: "person-david",  activityType: "coffee"       as ActivityType, date: d(108), locationName: "Bluestone Lane, West Village",  latitude: 40.7348, longitude: -74.0065, mood: "neutral"  as Mood, initiatedBy: "me"     as InitiatedBy, notes: "A bit distracted – I wasn't fully present.",                                               createdAt: d(108), updatedAt: d(108)},

  // Elena Rossi
  { id: "act-21", personId: "person-elena",  activityType: "date"         as ActivityType, date: d(1),   locationName: "Lilia, Williamsburg",            latitude: 40.7209, longitude: -73.9512, mood: "happy"    as Mood, initiatedBy: "me"     as InitiatedBy, notes: "Surprise dinner reservation. She loved it.",                                               createdAt: d(1),   updatedAt: d(1)  },
  { id: "act-22", personId: "person-elena",  activityType: "trip"         as ActivityType, date: d(8),   locationName: "Hudson Valley, NY",              latitude: 41.7004, longitude: -73.9295, mood: "happy"    as Mood, initiatedBy: "mutual" as InitiatedBy, notes: "Weekend trip. Hiked, ate well, stayed at a little inn by the river.",                    createdAt: d(8),   updatedAt: d(8)  },
  { id: "act-23", personId: "person-elena",  activityType: "coffee"       as ActivityType, date: d(14),  locationName: "Devoción, Williamsburg",         latitude: 40.7182, longitude: -73.9609, mood: "relaxed"  as Mood, initiatedBy: "them"   as InitiatedBy, notes: "She found this Colombian coffee shop.",                                                      createdAt: d(14),  updatedAt: d(14) },
  { id: "act-24", personId: "person-elena",  activityType: "event"        as ActivityType, date: d(28),  locationName: "ICP, Lower East Side",           latitude: 40.7196, longitude: -73.9966, mood: "happy"    as Mood, initiatedBy: "them"   as InitiatedBy, notes: "Her photo exhibit opened! So proud watching people respond to her work.",                  createdAt: d(28),  updatedAt: d(28) },
  { id: "act-25", personId: "person-elena",  activityType: "date"         as ActivityType, date: d(38),  locationName: "Gramercy Tavern, Gramercy",      latitude: 40.7384, longitude: -73.9882, mood: "happy"    as Mood, initiatedBy: "me"     as InitiatedBy, notes: "Two-month anniversary dinner.",                                                              createdAt: d(38),  updatedAt: d(38) },
  { id: "act-26", personId: "person-elena",  activityType: "chat"         as ActivityType, date: d(50),  locationName: "Domino Park, Williamsburg",      latitude: 40.7143, longitude: -73.9638, mood: "awkward"  as Mood, initiatedBy: "them"   as InitiatedBy, notes: "Had our first real disagreement. Uncomfortable but necessary.",                           createdAt: d(50),  updatedAt: d(50) },

  // Tom Nguyen
  { id: "act-27", personId: "person-tom",    activityType: "coffee"       as ActivityType, date: d(68),  locationName: "Gregory's Coffee, UWS",          latitude: 40.7846, longitude: -73.9766, mood: "neutral"  as Mood, initiatedBy: "them"   as InitiatedBy, notes: "Finally caught up after a long gap. Felt like we've drifted.",                          createdAt: d(68),  updatedAt: d(68) },
  { id: "act-28", personId: "person-tom",    activityType: "event"        as ActivityType, date: d(110), locationName: "Brooklyn Bowl, Williamsburg",    latitude: 40.7221, longitude: -73.9572, mood: "happy"    as Mood, initiatedBy: "them"   as InitiatedBy, notes: "His birthday party. Had a heart-to-heart in the corner.",                                 createdAt: d(110), updatedAt: d(110)},
  { id: "act-29", personId: "person-tom",    activityType: "coffee"       as ActivityType, date: d(145), locationName: "Gregory's Coffee, UWS",          latitude: 40.7846, longitude: -73.9766, mood: "happy"    as Mood, initiatedBy: "me"     as InitiatedBy, notes: "Back when we did Saturday morning coffee regularly.",                                       createdAt: d(145), updatedAt: d(145)},
  { id: "act-30", personId: "person-tom",    activityType: "coffee"       as ActivityType, date: d(170), locationName: "Gregory's Coffee, UWS",          latitude: 40.7846, longitude: -73.9766, mood: "relaxed"  as Mood, initiatedBy: "mutual" as InitiatedBy, notes: "Post-gym ritual. Great conversation about life goals.",                                     createdAt: d(170), updatedAt: d(170)},

  // Priya Sharma
  { id: "act-31", personId: "person-priya",  activityType: "work_meeting" as ActivityType, date: d(85),  locationName: "Office, Hudson Yards",           latitude: 40.7538, longitude: -74.0004, mood: "neutral"  as Mood, initiatedBy: "them"   as InitiatedBy, notes: "Final project handoff call.",                                                               createdAt: d(85),  updatedAt: d(85) },
  { id: "act-32", personId: "person-priya",  activityType: "dinner"       as ActivityType, date: d(92),  locationName: "Momofuku Ssäm Bar, EV",          latitude: 40.7281, longitude: -73.9839, mood: "happy"    as Mood, initiatedBy: "them"   as InitiatedBy, notes: "Project wrap dinner. Great team energy.",                                                    createdAt: d(92),  updatedAt: d(92) },
  { id: "act-33", personId: "person-priya",  activityType: "coffee"       as ActivityType, date: d(105), locationName: "Joe Coffee, Midtown",            latitude: 40.7556, longitude: -73.9862, mood: "relaxed"  as Mood, initiatedBy: "me"     as InitiatedBy, notes: "Mid-sprint decompression.",                                                                  createdAt: d(105), updatedAt: d(105)},
  { id: "act-34", personId: "person-priya",  activityType: "work_meeting" as ActivityType, date: d(130), locationName: "Office, Hudson Yards",           latitude: 40.7538, longitude: -74.0004, mood: "tired"    as Mood, initiatedBy: "them"   as InitiatedBy, notes: "Roadmap review. Long one. Both exhausted.",                                                  createdAt: d(130), updatedAt: d(130)},

  // James O'Brien
  { id: "act-35", personId: "person-james",  activityType: "dinner"       as ActivityType, date: d(42),  locationName: "Peter Luger, Williamsburg",      latitude: 40.7097, longitude: -73.9626, mood: "happy"    as Mood, initiatedBy: "them"   as InitiatedBy, notes: "His birthday dinner – just the two of us for once.",                                       createdAt: d(42),  updatedAt: d(42) },
  { id: "act-36", personId: "person-james",  activityType: "call"         as ActivityType, date: d(60),  locationName: null,                             latitude: null,    longitude: null,      mood: "neutral"  as Mood, initiatedBy: "them"   as InitiatedBy, notes: "He called to check in. Talked for 20 minutes.",                                            createdAt: d(60),  updatedAt: d(60) },
  { id: "act-37", personId: "person-james",  activityType: "dinner"       as ActivityType, date: d(102), locationName: "Mom's place, Park Slope",        latitude: 40.6782, longitude: -73.9780, mood: "relaxed"  as Mood, initiatedBy: "mutual" as InitiatedBy, notes: "Sunday family dinner. Felt warm and easy.",                                                  createdAt: d(102), updatedAt: d(102)},
  { id: "act-38", personId: "person-james",  activityType: "chat"         as ActivityType, date: d(155), locationName: "Prospect Park, Brooklyn",        latitude: 40.6602, longitude: -73.9690, mood: "happy"    as Mood, initiatedBy: "me"     as InitiatedBy, notes: "Long walk in the park. He opened up about some struggles.",                                 createdAt: d(155), updatedAt: d(155)},
];

// ── Relationship Insights ─────────────────────────────────────────────────────

export const MOCK_INSIGHTS: RelationshipInsight[] = [
  { id: "ins-1", personId: "person-sarah",  closenessScore: 82, lastInteractionDate: d(3),   interactionCount30d: 2, interactionCount90d: 5, dominantMood: "happy"   as Mood, initiativeBalance:  0.1,  trendDirection: "steady" as TrendDirection, nextReminderAt: null, updatedAt: d(0) },
  { id: "ins-2", personId: "person-marcus", closenessScore: 58, lastInteractionDate: d(2),   interactionCount30d: 2, interactionCount90d: 4, dominantMood: "neutral" as Mood, initiativeBalance: -0.2,  trendDirection: "steady" as TrendDirection, nextReminderAt: null, updatedAt: d(0) },
  { id: "ins-3", personId: "person-yuki",   closenessScore: 70, lastInteractionDate: d(25),  interactionCount30d: 3, interactionCount90d: 4, dominantMood: "happy"   as Mood, initiativeBalance:  0.2,  trendDirection: "up"     as TrendDirection, nextReminderAt: null, updatedAt: d(0) },
  { id: "ins-4", personId: "person-david",  closenessScore: 65, lastInteractionDate: d(12),  interactionCount30d: 1, interactionCount90d: 3, dominantMood: "relaxed" as Mood, initiativeBalance:  0.5,  trendDirection: "steady" as TrendDirection, nextReminderAt: null, updatedAt: d(0) },
  { id: "ins-5", personId: "person-elena",  closenessScore: 91, lastInteractionDate: d(1),   interactionCount30d: 4, interactionCount90d: 6, dominantMood: "happy"   as Mood, initiativeBalance:  0.3,  trendDirection: "up"     as TrendDirection, nextReminderAt: null, updatedAt: d(0) },
  { id: "ins-6", personId: "person-tom",    closenessScore: 32, lastInteractionDate: d(68),  interactionCount30d: 0, interactionCount90d: 1, dominantMood: "neutral" as Mood, initiativeBalance: -0.5,  trendDirection: "down"   as TrendDirection, nextReminderAt: subDays(now, -1), updatedAt: d(0) },
  { id: "ins-7", personId: "person-priya",  closenessScore: 41, lastInteractionDate: d(85),  interactionCount30d: 0, interactionCount90d: 0, dominantMood: "neutral" as Mood, initiativeBalance: -0.3,  trendDirection: "down"   as TrendDirection, nextReminderAt: subDays(now, -1), updatedAt: d(0) },
  { id: "ins-8", personId: "person-james",  closenessScore: 48, lastInteractionDate: d(42),  interactionCount30d: 0, interactionCount90d: 1, dominantMood: "relaxed" as Mood, initiativeBalance: -0.4,  trendDirection: "steady" as TrendDirection, nextReminderAt: subDays(now, -3), updatedAt: d(0) },
];

// ── Person-to-person connections ──────────────────────────────────────────────
// These represent relationships between people in your circle (not just user→person).
// They enrich the graph by showing your friends' connections to each other.

export interface PersonConnection {
  id: string;
  sourceId: string;
  targetId: string;
  strength: number; // 0–100
  type: "friend" | "colleague" | "mentor" | "acquaintance" | "family";
  label?: string;
}

export const MOCK_CONNECTIONS: PersonConnection[] = [
  // Friend cluster — Sarah, Yuki, and Tom all know each other
  { id: "conn-1", sourceId: "person-sarah",  targetId: "person-yuki",   strength: 78, type: "friend",      label: "College friends" },
  { id: "conn-2", sourceId: "person-sarah",  targetId: "person-tom",    strength: 48, type: "friend",      label: "Mutual friend group" },
  { id: "conn-3", sourceId: "person-yuki",   targetId: "person-tom",    strength: 38, type: "acquaintance", label: "Met through me" },

  // Sarah introduced Elena to their friend circle
  { id: "conn-4", sourceId: "person-sarah",  targetId: "person-elena",  strength: 62, type: "friend",      label: "Introduced by me" },

  // Work cluster — Marcus and Priya are on the same team
  { id: "conn-5", sourceId: "person-marcus", targetId: "person-priya",  strength: 68, type: "colleague",   label: "Same product team" },

  // David (mentor) has a past professional relationship with Marcus
  { id: "conn-6", sourceId: "person-david",  targetId: "person-marcus", strength: 45, type: "mentor",      label: "Former colleague" },

  // James (family) met Tom at my birthday party
  { id: "conn-7", sourceId: "person-james",  targetId: "person-tom",    strength: 28, type: "acquaintance", label: "Met at my birthday" },

  // Tom and Marcus vaguely know each other from a group dinner
  { id: "conn-8", sourceId: "person-tom",    targetId: "person-marcus", strength: 22, type: "acquaintance", label: "Group dinner" },
];

// ── Derived join types ─────────────────────────────────────────────────────────

export type PersonWithInsightAndActivities = Person & {
  relationshipInsight: RelationshipInsight | null;
  activities: Activity[];
};

export type ActivityWithPerson = Activity & {
  person: Person;
};

export function getPeopleWithInsights(): PersonWithInsightAndActivities[] {
  return MOCK_PEOPLE.map((p) => ({
    ...p,
    relationshipInsight: MOCK_INSIGHTS.find((i) => i.personId === p.id) ?? null,
    activities: MOCK_ACTIVITIES.filter((a) => a.personId === p.id),
  }));
}

// In-memory edits store (persists for the server process lifetime)
const activityEdits = new Map<string, Partial<Activity>>();

export function getActivitiesWithPeople(): ActivityWithPerson[] {
  return MOCK_ACTIVITIES.map((a) => ({
    ...a,
    ...activityEdits.get(a.id),
    person: MOCK_PEOPLE.find((p) => p.id === a.personId)!,
  })).sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getActivityById(id: string): ActivityWithPerson | null {
  const base = MOCK_ACTIVITIES.find((a) => a.id === id);
  if (!base) return null;
  return {
    ...base,
    ...activityEdits.get(id),
    person: MOCK_PEOPLE.find((p) => p.id === base.personId)!,
  };
}

export function patchActivity(id: string, patch: Partial<Activity>): ActivityWithPerson | null {
  const base = MOCK_ACTIVITIES.find((a) => a.id === id);
  if (!base) return null;
  activityEdits.set(id, { ...(activityEdits.get(id) ?? {}), ...patch, updatedAt: new Date() });
  return getActivityById(id);
}

export function getGraphData() {
  return {
    people: getPeopleWithInsights(),
    connections: MOCK_CONNECTIONS,
  };
}

export function getPersonById(id: string): PersonWithInsightAndActivities | null {
  const person = MOCK_PEOPLE.find((p) => p.id === id);
  if (!person) return null;
  return {
    ...person,
    relationshipInsight: MOCK_INSIGHTS.find((i) => i.personId === id) ?? null,
    activities: MOCK_ACTIVITIES.filter((a) => a.personId === id).sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    ),
  };
}
