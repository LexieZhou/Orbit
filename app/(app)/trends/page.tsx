export const dynamic = "force-dynamic";

import { getPeopleWithInsights, getActivitiesWithPeople } from "@/lib/mock-data";
import { buildClosenessTimeline } from "@/lib/scoring";
import { format, subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FrequencyChart } from "@/components/trends/FrequencyChart";
import { ClosenessChart } from "@/components/trends/ClosenessChart";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { closenessColor, getInitials, daysSince } from "@/lib/utils";
import { RELATIONSHIP_LABELS, RELATIONSHIP_COLORS } from "@/types";
import Link from "next/link";

function getTrendsData() {
  const people = getPeopleWithInsights();
  const allActivities = getActivitiesWithPeople();

  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) =>
    format(subMonths(now, 5 - i), "yyyy-MM")
  );

  const peopleWithTrends = people.map((person) => {
    const monthlyData = months.map((m) => ({
      month: m,
      count: person.activities.filter((a) => format(a.date, "yyyy-MM") === m).length,
    }));
    const timeline = buildClosenessTimeline(person.activities);
    const trendDirection = person.relationshipInsight?.trendDirection ?? "steady";
    const days = daysSince(person.relationshipInsight?.lastInteractionDate ?? null);
    return { person, monthlyData, timeline, trendDirection, days };
  });

  const overallMonthly = months.map((m) => ({
    month: m,
    count: allActivities.filter((a) => format(a.date, "yyyy-MM") === m).length,
  }));

  const growing = peopleWithTrends.filter((p) => p.trendDirection === "up");
  const fading  = peopleWithTrends.filter((p) => p.trendDirection === "down");

  return { peopleWithTrends, overallMonthly, growing, fading };
}

function TrendIcon({ direction }: { direction: string }) {
  if (direction === "up")   return <TrendingUp   className="h-4 w-4 text-emerald-500" />;
  if (direction === "down") return <TrendingDown  className="h-4 w-4 text-rose-500"   />;
  return                           <Minus          className="h-4 w-4 text-muted-foreground" />;
}

export default function TrendsPage() {
  const { peopleWithTrends, overallMonthly, growing, fading } = getTrendsData();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Trends & Insights</h2>
        <p className="text-muted-foreground mt-1">How your relationships have evolved over time.</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Overall Activity — Last 6 Months</CardTitle>
          <CardDescription>Total interactions per month across all relationships</CardDescription>
        </CardHeader>
        <CardContent>
          <FrequencyChart data={overallMonthly} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <TrendingUp className="h-5 w-5" /> Growing ({growing.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {growing.length === 0 ? (
              <p className="text-sm text-muted-foreground">None right now — keep reaching out!</p>
            ) : growing.map(({ person }) => (
              <Link key={person.id} href={`/people/${person.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={person.avatarUrl ?? undefined} />
                  <AvatarFallback className="text-xs">{getInitials(person.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{RELATIONSHIP_LABELS[person.relationshipType]} · {person.relationshipInsight?.interactionCount30d ?? 0} this month</p>
                </div>
                <span className="ml-auto text-xs font-semibold text-emerald-600">{Math.round(person.relationshipInsight?.closenessScore ?? 0)}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-rose-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-rose-600">
              <TrendingDown className="h-5 w-5" /> Fading ({fading.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {fading.length === 0 ? (
              <p className="text-sm text-muted-foreground">No fading relationships — great work!</p>
            ) : fading.map(({ person, days }) => (
              <Link key={person.id} href={`/people/${person.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={person.avatarUrl ?? undefined} />
                  <AvatarFallback className="text-xs">{getInitials(person.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{days !== null ? `Last seen ${days}d ago` : "No recent contact"}</p>
                </div>
                <span className="ml-auto text-xs font-semibold text-rose-500">{Math.round(person.relationshipInsight?.closenessScore ?? 0)}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Individual Trends</h3>
        <div className="space-y-6">
          {peopleWithTrends.map(({ person, monthlyData, timeline, trendDirection, days }) => {
            const score = person.relationshipInsight?.closenessScore ?? 0;
            return (
              <Card key={person.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={person.avatarUrl ?? undefined} />
                      <AvatarFallback className="text-sm">{getInitials(person.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link href={`/people/${person.id}`} className="font-semibold hover:text-primary transition-colors">{person.name}</Link>
                        <TrendIcon direction={trendDirection} />
                        {trendDirection === "down" && <Badge variant="danger"  className="text-[10px]">Fading</Badge>}
                        {trendDirection === "up"   && <Badge variant="success" className="text-[10px]">Growing</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {RELATIONSHIP_LABELS[person.relationshipType]}
                        {days !== null && ` · ${days === 0 ? "Seen today" : `${days}d since last interaction`}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${closenessColor(score)}`}>{Math.round(score)}</p>
                      <p className="text-xs text-muted-foreground">closeness</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Monthly Interactions</p>
                      <FrequencyChart data={monthlyData} color={RELATIONSHIP_COLORS[person.relationshipType]} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Closeness Trend</p>
                      <ClosenessChart data={timeline} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
