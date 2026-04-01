export const dynamic = "force-dynamic";

import Link from "next/link";
import { differenceInDays } from "date-fns";
import { getPeopleWithInsights, getActivitiesWithPeople } from "@/lib/mock-data";
import { generateReminders } from "@/lib/reminders";
import { getInitials, daysSince } from "@/lib/utils";
import { RELATIONSHIP_COLORS } from "@/types";
import type { PersonWithInsightAndActivities } from "@/lib/mock-data";
import type { ReminderItem } from "@/types";

// ── Data helpers ──────────────────────────────────────────────────────────────

interface PositiveSignal {
  icon: string;
  title: string;
  body: string;
  personId?: string;
  dot: "green" | "teal" | "violet";
}

function derivePositiveSignals(
  people: PersonWithInsightAndActivities[]
): PositiveSignal[] {
  const signals: PositiveSignal[] = [];

  people.forEach((p) => {
    const ins = p.relationshipInsight;
    if (!ins) return;
    const firstName = p.name.split(" ")[0];

    // Growing trend
    if (ins.trendDirection === "up" && ins.closenessScore >= 55) {
      signals.push({
        icon: "🌱",
        title: `${firstName} is growing`,
        body: `Your closeness with ${firstName} has been trending up. Keep the momentum going.`,
        personId: p.id,
        dot: "green",
      });
    }

    // They initiate more (negative balance = they reach out more)
    if (ins.initiativeBalance < -0.25) {
      signals.push({
        icon: "✨",
        title: `${firstName} keeps reaching out`,
        body: `${firstName} has initiated most of your recent interactions. Something is building.`,
        personId: p.id,
        dot: "teal",
      });
    }

    // High closeness + very recent
    const days = daysSince(ins.lastInteractionDate);
    if (ins.closenessScore >= 80 && days !== null && days <= 7) {
      signals.push({
        icon: "💛",
        title: `Strong bond with ${firstName}`,
        body: `Closeness score of ${Math.round(ins.closenessScore)} — one of your closest connections right now.`,
        personId: p.id,
        dot: "violet",
      });
    }
  });

  // Core circle signal
  const top3 = [...people]
    .filter((p) => p.relationshipInsight)
    .sort((a, b) => (b.relationshipInsight?.closenessScore ?? 0) - (a.relationshipInsight?.closenessScore ?? 0))
    .slice(0, 3);
  if (top3.length === 3) {
    const names = top3.map((p) => p.name.split(" ")[0]).join(", ");
    signals.push({
      icon: "💡",
      title: "Your core circle",
      body: `${names} have the highest closeness scores in your orbit right now.`,
      dot: "violet",
    });
  }

  return signals.slice(0, 5);
}

function getHealthCounts(people: PersonWithInsightAndActivities[]) {
  let thriving = 0, stable = 0, fading = 0;
  people.forEach((p) => {
    const s = p.relationshipInsight?.closenessScore ?? 0;
    const t = p.relationshipInsight?.trendDirection ?? "steady";
    if (s >= 65 || t === "up") thriving++;
    else if (t === "down" || s < 35) fading++;
    else stable++;
  });
  return { thriving, stable, fading };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase mb-4">
      {children}
    </p>
  );
}

const DOT_COLORS = {
  red:    "bg-rose-500",
  amber:  "bg-amber-400",
  green:  "bg-emerald-500",
  teal:   "bg-teal-400",
  violet: "bg-violet-500",
};

function InsightCard({
  icon,
  title,
  body,
  dotColor,
  cta,
  ctaHref,
}: {
  icon: string;
  title: string;
  body: string;
  dotColor: keyof typeof DOT_COLORS;
  cta?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white border border-border/60 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-semibold text-sm text-foreground">{title}</p>
          <span className={`w-2 h-2 rounded-full shrink-0 ${DOT_COLORS[dotColor]}`} />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
        {cta && ctaHref && (
          <Link href={ctaHref} className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-primary hover:underline">
            — {cta}
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const people = getPeopleWithInsights();
  const allActivities = getActivitiesWithPeople();
  const reminders = generateReminders(people);

  const highPriority = reminders.filter((r) => r.priority === "high");
  const medPriority  = reminders.filter((r) => r.priority === "medium");
  const positiveSignals = derivePositiveSignals(people);
  const { thriving, stable, fading } = getHealthCounts(people);

  // "Reach out this week" = top 3 highest-priority people
  const reachOutPeople = highPriority
    .slice(0, 3)
    .map((r) => people.find((p) => p.id === r.personId))
    .filter(Boolean) as PersonWithInsightAndActivities[];

  // Total activity count
  const activitiesThisWeek = allActivities.filter(
    (a) => differenceInDays(new Date(), a.date) <= 7
  ).length;

  return (
    <div className="space-y-10">

      {/* ── Page title ── */}
      <div>
        <p className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase mb-1">Social</p>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Insights</h1>
      </div>

      {/* ── Hero: Reach out this week (full width) ── */}
      {reachOutPeople.length > 0 && (
        <div
          className="rounded-2xl p-6 text-white"
          style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)" }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">🎯</span>
            <p className="font-bold text-lg">Reach out this week</p>
          </div>
          <p className="text-sm text-indigo-200 mb-5 leading-relaxed max-w-xl">
            These {reachOutPeople.length} connection{reachOutPeople.length !== 1 ? "s" : ""} are due for some love based on your patterns and timing.
          </p>
          <div className="flex gap-4 flex-wrap">
            {reachOutPeople.map((p) => (
              <Link key={p.id} href={`/people/${p.id}`} className="flex flex-col items-center gap-1.5 group">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-lg group-hover:scale-105 transition-transform"
                  style={{ background: `${RELATIONSHIP_COLORS[p.relationshipType]}cc` }}
                >
                  {p.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.avatarUrl} alt={p.name} className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    getInitials(p.name)
                  )}
                </div>
                <span className="text-xs font-medium text-white/90">{p.name.split(" ")[0]}</span>
                <span className="text-[10px] text-indigo-300 capitalize">{p.relationshipType === "coworker" ? "Work" : p.relationshipType}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Left column */}
        <div className="space-y-8">
          {/* Needs Attention */}
          {highPriority.length > 0 && (
            <section>
              <SectionLabel>Needs Attention</SectionLabel>
              <div className="space-y-3">
                {highPriority.map((r) => (
                  <InsightCard
                    key={r.personId}
                    icon={reminderIcon(r)}
                    title={reminderTitle(r)}
                    body={r.message}
                    dotColor="red"
                    cta={reminderCta(r)}
                    ctaHref={`/people/${r.personId}`}
                  />
                ))}
              </div>
            </section>
          )}

          {/* To Keep in Mind */}
          {medPriority.length > 0 && (
            <section>
              <SectionLabel>To Keep in Mind</SectionLabel>
              <div className="space-y-3">
                {medPriority.map((r) => (
                  <InsightCard
                    key={r.personId}
                    icon={reminderIcon(r)}
                    title={reminderTitle(r)}
                    body={r.message}
                    dotColor="amber"
                    cta={reminderCta(r)}
                    ctaHref={`/people/${r.personId}`}
                  />
                ))}
                {highPriority.length + medPriority.length >= 3 && (
                  <InsightCard
                    icon="🎯"
                    title={`${highPriority.length + medPriority.length} people to reach out to`}
                    body={`Based on patterns and timing: ${[...highPriority, ...medPriority].slice(0, 3).map((r) => r.personName.split(" ")[0]).join(", ")} are all due for contact.`}
                    dotColor="amber"
                  />
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Positive Signals */}
          {positiveSignals.length > 0 && (
            <section>
              <SectionLabel>Positive Signals</SectionLabel>
              <div className="space-y-3">
                {positiveSignals.map((s, i) => (
                  <InsightCard
                    key={i}
                    icon={s.icon}
                    title={s.title}
                    body={s.body}
                    dotColor={s.dot === "green" ? "green" : s.dot === "teal" ? "teal" : "violet"}
                    cta={s.personId ? "View profile" : undefined}
                    ctaHref={s.personId ? `/people/${s.personId}` : undefined}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Relationship Health */}
          <section>
            <SectionLabel>Relationship Health</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              <HealthTile emoji="🌱" label="Thriving" count={thriving} bg="bg-emerald-50 dark:bg-emerald-950/30" countColor="text-emerald-600" />
              <HealthTile emoji="⚖️" label="Stable"   count={stable}   bg="bg-violet-50 dark:bg-violet-950/30"  countColor="text-violet-600" />
              <HealthTile emoji="🌫️" label="Fading"   count={fading}   bg="bg-rose-50 dark:bg-rose-950/30"     countColor="text-rose-500" />
            </div>
          </section>

          {/* Activity this week */}
          <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900">
            <div>
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">This week</p>
              <p className="text-xs text-indigo-500 mt-0.5">
                {activitiesThisWeek === 0 ? "No interactions logged yet" : `${activitiesThisWeek} interaction${activitiesThisWeek !== 1 ? "s" : ""} logged`}
              </p>
            </div>
            <Link
              href="/activities/new"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
            >
              Log one now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Tiles ─────────────────────────────────────────────────────────────────────

function HealthTile({ emoji, label, count, bg, countColor }: {
  emoji: string; label: string; count: number; bg: string; countColor: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-1 py-4 rounded-2xl ${bg} border border-border/40`}>
      <span className="text-xl">{emoji}</span>
      <span className={`text-2xl font-extrabold ${countColor}`}>{count}</span>
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

// ── Reminder helpers ──────────────────────────────────────────────────────────

function reminderIcon(r: ReminderItem): string {
  const icons: Record<string, string> = {
    reconnect: "🌙",
    fading: "📉",
    reciprocity: "⚖️",
    memory: "📍",
  };
  return icons[r.type] ?? "💬";
}

function reminderTitle(r: ReminderItem): string {
  const firstName = r.personName.split(" ")[0];
  const titles: Record<string, string> = {
    reconnect: `${firstName} misses you`,
    fading: `${firstName} is fading`,
    reciprocity: `${firstName} reaches out more`,
    memory: `Catch up with ${firstName}`,
  };
  return titles[r.type] ?? `Reconnect with ${firstName}`;
}

function reminderCta(r: ReminderItem): string {
  const ctas: Record<string, string> = {
    reconnect: "Reach out today",
    fading: "Log an interaction",
    reciprocity: "Be the one to initiate",
    memory: "Plan a catch-up",
  };
  return ctas[r.type] ?? "View profile";
}
