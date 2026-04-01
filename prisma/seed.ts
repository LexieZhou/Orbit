import { PrismaClient, RelationshipType, ActivityType, Mood, InitiatedBy } from "@prisma/client";
import { subDays, subHours } from "date-fns";

const prisma = new PrismaClient();

const now = new Date();

function daysAgo(days: number, hoursOffset = 0): Date {
  return subHours(subDays(now, days), hoursOffset);
}

async function main() {
  console.log("🌱 Seeding Orbit database...");

  // Clean existing data
  await prisma.relationshipInsight.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.person.deleteMany();

  // ── People ──────────────────────────────────────────────────────────────────
  const people = await Promise.all([
    prisma.person.create({
      data: {
        id: "person-sarah",
        name: "Sarah Chen",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Sarah",
        relationshipType: RelationshipType.friend,
        notes: "Met at a design meetup in 2021. She works at a startup in SoHo. Always down for coffee chats about life and creativity.",
      },
    }),
    prisma.person.create({
      data: {
        id: "person-marcus",
        name: "Marcus Williams",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Marcus",
        relationshipType: RelationshipType.coworker,
        notes: "Senior engineer on the platform team. We bonded over a shared interest in distributed systems and good espresso.",
      },
    }),
    prisma.person.create({
      data: {
        id: "person-yuki",
        name: "Yuki Tanaka",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Yuki",
        relationshipType: RelationshipType.friend,
        notes: "College friend, now living in SF. We stay close through visits and long calls. She always brings out the best in me.",
      },
    }),
    prisma.person.create({
      data: {
        id: "person-david",
        name: "David Park",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=David",
        relationshipType: RelationshipType.mentor,
        notes: "My former manager. Incredibly wise. Monthly coffee check-ins have shaped how I think about my career.",
      },
    }),
    prisma.person.create({
      data: {
        id: "person-elena",
        name: "Elena Rossi",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Elena",
        relationshipType: RelationshipType.romantic,
        notes: "Met through a mutual friend at a gallery opening. She's a photographer with an infectious sense of adventure.",
      },
    }),
    prisma.person.create({
      data: {
        id: "person-tom",
        name: "Tom Nguyen",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Tom",
        relationshipType: RelationshipType.friend,
        notes: "Gym buddy turned close friend. We used to grab breakfast every Saturday but haven't caught up properly in a while.",
      },
    }),
    prisma.person.create({
      data: {
        id: "person-priya",
        name: "Priya Sharma",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Priya",
        relationshipType: RelationshipType.coworker,
        notes: "Product manager I collaborated with on the mobile re-launch. Sharp thinker. We grabbed lunch a lot during crunch.",
      },
    }),
    prisma.person.create({
      data: {
        id: "person-james",
        name: "James O'Brien",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=James",
        relationshipType: RelationshipType.family,
        notes: "My older brother. Lives in Brooklyn. We don't see each other as often as we should.",
      },
    }),
  ]);

  console.log(`✅ Created ${people.length} people`);

  // ── Activities ───────────────────────────────────────────────────────────────
  const activities = await prisma.activity.createMany({
    data: [
      // Sarah Chen – close friend, frequent positive interactions
      {
        personId: "person-sarah",
        activityType: ActivityType.coffee,
        date: daysAgo(3),
        locationName: "La Colombe, Nolita",
        latitude: 40.7223,
        longitude: -73.9969,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.mutual,
        notes: "Caught up over oat lattes. She's thinking about leaving her startup to go independent. Really good conversation.",
      },
      {
        personId: "person-sarah",
        activityType: ActivityType.dinner,
        date: daysAgo(18),
        locationName: "Cervo's, Lower East Side",
        latitude: 40.7197,
        longitude: -73.9889,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.them,
        notes: "She picked this place – amazing Portuguese food. Ended up talking for 3 hours.",
      },
      {
        personId: "person-sarah",
        activityType: ActivityType.event,
        date: daysAgo(35),
        locationName: "MoMA, Midtown",
        latitude: 40.7614,
        longitude: -73.9776,
        mood: Mood.relaxed,
        initiatedBy: InitiatedBy.me,
        notes: "Saw the Matisse exhibit together. She knew so much about the work – I felt like I had a personal guide.",
      },
      {
        personId: "person-sarah",
        activityType: ActivityType.coffee,
        date: daysAgo(55),
        locationName: "Intelligentsia, High Line",
        latitude: 40.748,
        longitude: -74.0048,
        mood: Mood.relaxed,
        initiatedBy: InitiatedBy.me,
        notes: "Quick afternoon coffee before she had a client call. Short but always feel recharged after seeing her.",
      },
      {
        personId: "person-sarah",
        activityType: ActivityType.chat,
        date: daysAgo(72),
        locationName: "Washington Square Park",
        latitude: 40.7308,
        longitude: -73.9973,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.mutual,
        notes: "Spontaneous walk and talk in the park. Ran into her on the way to the library.",
      },
      {
        personId: "person-sarah",
        activityType: ActivityType.dinner,
        date: daysAgo(95),
        locationName: "Via Carota, West Village",
        latitude: 40.7332,
        longitude: -74.0047,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.them,
        notes: "Birthday dinner she organized. Perfect evening with great food and even better company.",
      },

      // Marcus – coworker, work-heavy but also friendly
      {
        personId: "person-marcus",
        activityType: ActivityType.work_meeting,
        date: daysAgo(2),
        locationName: "Office, Hudson Yards",
        latitude: 40.7538,
        longitude: -74.0004,
        mood: Mood.neutral,
        initiatedBy: InitiatedBy.them,
        notes: "Architecture review for the new pipeline. Productive session, aligned on the caching strategy.",
      },
      {
        personId: "person-marcus",
        activityType: ActivityType.coffee,
        date: daysAgo(9),
        locationName: "Think Coffee, Midtown",
        latitude: 40.7551,
        longitude: -73.9918,
        mood: Mood.relaxed,
        initiatedBy: InitiatedBy.me,
        notes: "Not work talk for once – chatted about side projects and burned-out culture in tech.",
      },
      {
        personId: "person-marcus",
        activityType: ActivityType.work_meeting,
        date: daysAgo(16),
        locationName: "Office, Hudson Yards",
        latitude: 40.7538,
        longitude: -74.0004,
        mood: Mood.neutral,
        initiatedBy: InitiatedBy.them,
        notes: "Sprint planning. A bit tense about the deadline but we sorted priorities.",
      },
      {
        personId: "person-marcus",
        activityType: ActivityType.coffee,
        date: daysAgo(40),
        locationName: "Blue Bottle, Williamsburg",
        latitude: 40.7148,
        longitude: -73.9614,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.mutual,
        notes: "He recommended this spot and it did not disappoint. Good talk about career and where we both want to go.",
      },
      {
        personId: "person-marcus",
        activityType: ActivityType.work_meeting,
        date: daysAgo(58),
        locationName: "Office, Hudson Yards",
        latitude: 40.7538,
        longitude: -74.0004,
        mood: Mood.awkward,
        initiatedBy: InitiatedBy.them,
        notes: "Post-incident debrief. Tension in the room. He did well to diffuse it.",
      },

      // Yuki – close SF friend, less frequent but high quality
      {
        personId: "person-yuki",
        activityType: ActivityType.trip,
        date: daysAgo(25),
        locationName: "Ferry Building, San Francisco",
        latitude: 37.7955,
        longitude: -122.3937,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.mutual,
        notes: "Flew out to SF for the weekend. Explored the Ferry Building Farmers Market together – she knows every vendor.",
      },
      {
        personId: "person-yuki",
        activityType: ActivityType.dinner,
        date: daysAgo(26),
        locationName: "Nopa, SF",
        latitude: 37.7762,
        longitude: -122.4304,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.them,
        notes: "Late-night dinner at Nopa – she insisted on the whole roasted chicken. We closed the place down talking.",
      },
      {
        personId: "person-yuki",
        activityType: ActivityType.call,
        date: daysAgo(45),
        locationName: null,
        latitude: null,
        longitude: null,
        mood: Mood.relaxed,
        initiatedBy: InitiatedBy.me,
        notes: "Long video call to catch up. She's thinking about moving back east. Fingers crossed.",
      },
      {
        personId: "person-yuki",
        activityType: ActivityType.call,
        date: daysAgo(78),
        locationName: null,
        latitude: null,
        longitude: null,
        mood: Mood.neutral,
        initiatedBy: InitiatedBy.them,
        notes: "She called to vent about work stuff. Listened mostly. Glad she feels comfortable enough to open up.",
      },
      {
        personId: "person-yuki",
        activityType: ActivityType.trip,
        date: daysAgo(120),
        locationName: "Golden Gate Park, SF",
        latitude: 37.7694,
        longitude: -122.4862,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.mutual,
        notes: "Last big visit. Rented bikes and rode through the park. One of my favorite days this year.",
      },

      // David – mentor, regular but intentional cadence
      {
        personId: "person-david",
        activityType: ActivityType.coffee,
        date: daysAgo(12),
        locationName: "Bluestone Lane, West Village",
        latitude: 40.7348,
        longitude: -74.0065,
        mood: Mood.relaxed,
        initiatedBy: InitiatedBy.me,
        notes: "Monthly check-in. Talked through an offer I got. He asked exactly the right questions to help me think it through.",
      },
      {
        personId: "person-david",
        activityType: ActivityType.coffee,
        date: daysAgo(45),
        locationName: "Bluestone Lane, West Village",
        latitude: 40.7348,
        longitude: -74.0065,
        mood: Mood.relaxed,
        initiatedBy: InitiatedBy.me,
        notes: "Usual spot. He shared perspective on navigating difficult stakeholders. Always leaves me with 2–3 things to think on.",
      },
      {
        personId: "person-david",
        activityType: ActivityType.dinner,
        date: daysAgo(75),
        locationName: "The NoMad, Flatiron",
        latitude: 40.7444,
        longitude: -73.9887,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.them,
        notes: "He invited me to a dinner with a few other people he mentors. Really inspiring group. Felt grateful.",
      },
      {
        personId: "person-david",
        activityType: ActivityType.coffee,
        date: daysAgo(108),
        locationName: "Bluestone Lane, West Village",
        latitude: 40.7348,
        longitude: -74.0065,
        mood: Mood.neutral,
        initiatedBy: InitiatedBy.me,
        notes: "A bit distracted – I wasn't fully present. Resolved to come better prepared next time.",
      },

      // Elena – romantic partner, very active recent interactions
      {
        personId: "person-elena",
        activityType: ActivityType.date,
        date: daysAgo(1),
        locationName: "Lilia, Williamsburg",
        latitude: 40.7209,
        longitude: -73.9512,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.me,
        notes: "Surprise dinner reservation. She loved it. Long walk home along the water after. Perfect night.",
      },
      {
        personId: "person-elena",
        activityType: ActivityType.trip,
        date: daysAgo(8),
        locationName: "Hudson Valley, NY",
        latitude: 41.7004,
        longitude: -73.9295,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.mutual,
        notes: "Weekend trip to Hudson Valley. Hiked, ate well, and stayed at a little inn by the river. One of those trips you want to never end.",
      },
      {
        personId: "person-elena",
        activityType: ActivityType.coffee,
        date: daysAgo(14),
        locationName: "Devoción, Williamsburg",
        latitude: 40.7182,
        longitude: -73.9609,
        mood: Mood.relaxed,
        initiatedBy: InitiatedBy.them,
        notes: "She found this Colombian coffee shop and insisted we go. Justifiably obsessed with it now.",
      },
      {
        personId: "person-elena",
        activityType: ActivityType.event,
        date: daysAgo(28),
        locationName: "International Center of Photography, LES",
        latitude: 40.7196,
        longitude: -73.9966,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.them,
        notes: "Her photo exhibit opened! I was so proud watching people respond to her work.",
      },
      {
        personId: "person-elena",
        activityType: ActivityType.date,
        date: daysAgo(38),
        locationName: "Gramercy Tavern, Gramercy",
        latitude: 40.7384,
        longitude: -73.9882,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.me,
        notes: "Two-month anniversary dinner. We're still figuring things out but this felt right.",
      },
      {
        personId: "person-elena",
        activityType: ActivityType.chat,
        date: daysAgo(50),
        locationName: "Domino Park, Williamsburg",
        latitude: 40.7143,
        longitude: -73.9638,
        mood: Mood.awkward,
        initiatedBy: InitiatedBy.them,
        notes: "Had our first real disagreement about future plans. Uncomfortable but necessary. We talked it out.",
      },

      // Tom – fading friendship, hasn't been in touch
      {
        personId: "person-tom",
        activityType: ActivityType.coffee,
        date: daysAgo(68),
        locationName: "Gregory's Coffee, UWS",
        latitude: 40.7846,
        longitude: -73.9766,
        mood: Mood.neutral,
        initiatedBy: InitiatedBy.them,
        notes: "Finally caught up after a long gap. It was fine but felt like we've drifted. Promised to be better about staying in touch.",
      },
      {
        personId: "person-tom",
        activityType: ActivityType.event,
        date: daysAgo(110),
        locationName: "Brooklyn Bowl, Williamsburg",
        latitude: 40.7221,
        longitude: -73.9572,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.them,
        notes: "His birthday party. Good crowd, lots of energy. We had a proper heart-to-heart in the corner for a while.",
      },
      {
        personId: "person-tom",
        activityType: ActivityType.coffee,
        date: daysAgo(145),
        locationName: "Gregorys Coffee, UWS",
        latitude: 40.7846,
        longitude: -73.9766,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.me,
        notes: "Back when we used to do Saturday morning coffee regularly. Really miss those.",
      },
      {
        personId: "person-tom",
        activityType: ActivityType.coffee,
        date: daysAgo(170),
        locationName: "Gregorys Coffee, UWS",
        latitude: 40.7846,
        longitude: -73.9766,
        mood: Mood.relaxed,
        initiatedBy: InitiatedBy.mutual,
        notes: "Post-gym ritual. Great conversation about life goals.",
      },

      // Priya – work friend, dropped off after project ended
      {
        personId: "person-priya",
        activityType: ActivityType.work_meeting,
        date: daysAgo(85),
        locationName: "Office, Hudson Yards",
        latitude: 40.7538,
        longitude: -74.0004,
        mood: Mood.neutral,
        initiatedBy: InitiatedBy.them,
        notes: "Final project handoff call. Bittersweet end to an intense collaboration.",
      },
      {
        personId: "person-priya",
        activityType: ActivityType.dinner,
        date: daysAgo(92),
        locationName: "Momofuku Ssäm Bar, EV",
        latitude: 40.7281,
        longitude: -73.9839,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.them,
        notes: "Project wrap dinner. Great team energy. Priya gave a really touching thank-you speech.",
      },
      {
        personId: "person-priya",
        activityType: ActivityType.coffee,
        date: daysAgo(105),
        locationName: "Joe Coffee, Midtown",
        latitude: 40.7556,
        longitude: -73.9862,
        mood: Mood.relaxed,
        initiatedBy: InitiatedBy.me,
        notes: "Mid-sprint decompression. Talked about how we'd approach the relaunch differently in hindsight.",
      },
      {
        personId: "person-priya",
        activityType: ActivityType.work_meeting,
        date: daysAgo(130),
        locationName: "Office, Hudson Yards",
        latitude: 40.7538,
        longitude: -74.0004,
        mood: Mood.tired,
        initiatedBy: InitiatedBy.them,
        notes: "Roadmap review. Long one. Lots of pushback from stakeholders. We were both exhausted.",
      },

      // James – family, not enough contact
      {
        personId: "person-james",
        activityType: ActivityType.dinner,
        date: daysAgo(42),
        locationName: "Peter Luger, Williamsburg",
        latitude: 40.7097,
        longitude: -73.9626,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.them,
        notes: "His birthday dinner – just the two of us for once. Reminded me how much I miss just hanging out with him.",
      },
      {
        personId: "person-james",
        activityType: ActivityType.call,
        date: daysAgo(60),
        locationName: null,
        latitude: null,
        longitude: null,
        mood: Mood.neutral,
        initiatedBy: InitiatedBy.them,
        notes: "He called to check in. We talked for about 20 minutes. Nothing heavy, just good to hear his voice.",
      },
      {
        personId: "person-james",
        activityType: ActivityType.dinner,
        date: daysAgo(102),
        locationName: "Mom's place, Park Slope",
        latitude: 40.6782,
        longitude: -73.978,
        mood: Mood.relaxed,
        initiatedBy: InitiatedBy.mutual,
        notes: "Sunday family dinner. Rare moment where everyone's schedule aligned. Felt warm and easy.",
      },
      {
        personId: "person-james",
        activityType: ActivityType.chat,
        date: daysAgo(155),
        locationName: "Prospect Park, Brooklyn",
        latitude: 40.6602,
        longitude: -73.969,
        mood: Mood.happy,
        initiatedBy: InitiatedBy.me,
        notes: "Long walk in the park. He opened up about some struggles. Good talk. Should do this more.",
      },
    ],
  });

  console.log(`✅ Created ${activities.count} activities`);

  // ── Relationship Insights (seeded, will be recalculated on demand) ────────────
  const insights = [
    { personId: "person-sarah",  closenessScore: 82, interactionCount30d: 2, interactionCount90d: 5, trendDirection: "steady",  initiativeBalance: 0.1,  dominantMood: "happy" },
    { personId: "person-marcus", closenessScore: 58, interactionCount30d: 2, interactionCount90d: 4, trendDirection: "steady",  initiativeBalance: -0.2, dominantMood: "neutral" },
    { personId: "person-yuki",   closenessScore: 70, interactionCount30d: 3, interactionCount90d: 4, trendDirection: "up",     initiativeBalance: 0.2,  dominantMood: "happy" },
    { personId: "person-david",  closenessScore: 65, interactionCount30d: 1, interactionCount90d: 3, trendDirection: "steady",  initiativeBalance: 0.5,  dominantMood: "relaxed" },
    { personId: "person-elena",  closenessScore: 91, interactionCount30d: 4, interactionCount90d: 6, trendDirection: "up",     initiativeBalance: 0.3,  dominantMood: "happy" },
    { personId: "person-tom",    closenessScore: 32, interactionCount30d: 0, interactionCount90d: 1, trendDirection: "down",   initiativeBalance: -0.5, dominantMood: "neutral" },
    { personId: "person-priya",  closenessScore: 41, interactionCount30d: 0, interactionCount90d: 0, trendDirection: "down",   initiativeBalance: -0.3, dominantMood: "neutral" },
    { personId: "person-james",  closenessScore: 48, interactionCount30d: 0, interactionCount90d: 1, trendDirection: "steady",  initiativeBalance: -0.4, dominantMood: "relaxed" },
  ];

  for (const insight of insights) {
    const typedInsight = {
      ...insight,
      trendDirection: insight.trendDirection as "up" | "steady" | "down",
      dominantMood: insight.dominantMood as Mood,
    };
    await prisma.relationshipInsight.upsert({
      where: { personId: insight.personId },
      update: typedInsight,
      create: {
        personId: insight.personId,
        closenessScore: insight.closenessScore,
        interactionCount30d: insight.interactionCount30d,
        interactionCount90d: insight.interactionCount90d,
        trendDirection: insight.trendDirection as "up" | "steady" | "down",
        initiativeBalance: insight.initiativeBalance,
        dominantMood: insight.dominantMood as Mood,
        lastInteractionDate: daysAgo(
          insight.personId === "person-sarah" ? 3
          : insight.personId === "person-marcus" ? 2
          : insight.personId === "person-yuki" ? 25
          : insight.personId === "person-david" ? 12
          : insight.personId === "person-elena" ? 1
          : insight.personId === "person-tom" ? 68
          : insight.personId === "person-priya" ? 85
          : 42
        ),
        nextReminderAt:
          insight.trendDirection === "down"
            ? daysAgo(-3) // 3 days from now
            : insight.interactionCount30d === 0
            ? daysAgo(-1)
            : null,
      },
    });
  }

  console.log("✅ Created relationship insights");
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
