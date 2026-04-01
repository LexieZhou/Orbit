export const dynamic = "force-dynamic";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { getPeopleWithInsights, getActivitiesWithPeople } from "@/lib/mock-data";
import { generateReminders } from "@/lib/reminders";
import { startOfMonth, subWeeks, format } from "date-fns";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentFeed } from "@/components/dashboard/RecentFeed";
import { ReminderList } from "@/components/dashboard/ReminderList";
import { MiniTrendChart } from "@/components/dashboard/MiniTrendChart";
import { TopPeople } from "@/components/dashboard/TopPeople";
import { Button } from "@/components/ui/button";
import { MOCK_USER } from "@/lib/mock-auth";

function getDashboardData() {
  const people = getPeopleWithInsights();
  const allActivitiesWithPeople = getActivitiesWithPeople();
  const recentActivities = allActivitiesWithPeople.slice(0, 8);

  const now = new Date();
  const totalActivities = allActivitiesWithPeople.length;
  const activitiesThisMonth = allActivitiesWithPeople.filter(
    (a) => a.date >= startOfMonth(now)
  ).length;

  const insights = people
    .map((p) => p.relationshipInsight?.closenessScore ?? 0)
    .filter((s) => s > 0);
  const averageCloseness =
    insights.length > 0
      ? insights.reduce((sum, s) => sum + s, 0) / insights.length
      : 0;

  // Build weekly interaction chart for last 12 weeks
  const weeklyData = Array.from({ length: 12 }, (_, i) => {
    const weekStart = subWeeks(now, 11 - i);
    const weekEnd = subWeeks(now, 10 - i);
    const count = allActivitiesWithPeople.filter(
      (a) => a.date >= weekStart && a.date < weekEnd
    ).length;
    return { date: format(weekStart, "yyyy-MM-dd"), count };
  });

  const reminders = generateReminders(people);

  return {
    people,
    recentActivities,
    totalActivities,
    activitiesThisMonth,
    averageCloseness,
    weeklyData,
    reminders,
  };
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export default function DashboardPage() {
  const {
    people,
    recentActivities,
    totalActivities,
    activitiesThisMonth,
    averageCloseness,
    weeklyData,
    reminders,
  } = getDashboardData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Good {getGreeting()}, {MOCK_USER.name.split(" ")[0]} 👋
          </h2>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your relationships today.
          </p>
        </div>
        <Link href="/activities/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Log Interaction
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <StatsCards
        totalPeople={people.length}
        totalActivities={totalActivities}
        activitiesThisMonth={activitiesThisMonth}
        averageCloseness={averageCloseness}
      />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentFeed activities={recentActivities} />
          <ReminderList reminders={reminders} compact />
        </div>
        <div className="space-y-6">
          <MiniTrendChart data={weeklyData} title="Weekly Activity" />
          <TopPeople people={people} />
        </div>
      </div>
    </div>
  );
}
