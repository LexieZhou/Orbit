export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getPersonById } from "@/lib/mock-data";
import { buildClosenessTimeline } from "@/lib/scoring";
import { generateReminders } from "@/lib/reminders";
import { PersonHeader } from "@/components/people/PersonHeader";
import { ActivityTimeline } from "@/components/activities/ActivityTimeline";
import { MoodDistributionChart } from "@/components/trends/MoodDistributionChart";
import { ClosenessChart } from "@/components/trends/ClosenessChart";
import { ReminderList } from "@/components/dashboard/ReminderList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { MapPin } from "lucide-react";
import Link from "next/link";

export default function PersonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const person = getPersonById(params.id);
  if (!person) notFound();

  const closenessTimeline = buildClosenessTimeline(person.activities);

  const reminders = generateReminders([person]).filter(
    (r) => r.personId === params.id
  );

  const initiativeCounts = {
    me:     person.activities.filter((a) => a.initiatedBy === "me").length,
    them:   person.activities.filter((a) => a.initiatedBy === "them").length,
    mutual: person.activities.filter((a) => a.initiatedBy === "mutual").length,
  };

  const locationCounts: Record<string, number> = {};
  person.activities.forEach((a) => {
    if (a.locationName) {
      locationCounts[a.locationName] = (locationCounts[a.locationName] || 0) + 1;
    }
  });
  const topLocations = Object.entries(locationCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const total = initiativeCounts.me + initiativeCounts.them + initiativeCounts.mutual;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: "People", href: "/people" },
        { label: person.name },
      ]} />

      <PersonHeader person={person} />

      {reminders.length > 0 && <ReminderList reminders={reminders} />}

      <Tabs defaultValue="timeline">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="places">Places</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <ActivityTimeline activities={person.activities} />
        </TabsContent>

        <TabsContent value="insights" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Mood Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <MoodDistributionChart activities={person.activities} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Initiative Balance</CardTitle>
              </CardHeader>
              <CardContent>
                {total === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
                ) : (
                  <div className="space-y-4 pt-2">
                    {[
                      { label: "Me",     count: initiativeCounts.me,     color: "bg-violet-500" },
                      { label: "Them",   count: initiativeCounts.them,   color: "bg-sky-500"    },
                      { label: "Mutual", count: initiativeCounts.mutual, color: "bg-emerald-500" },
                    ].map(({ label, count, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium">{label}</span>
                          <span className="text-muted-foreground">
                            {count} ({total > 0 ? Math.round((count / total) * 100) : 0}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${color}`}
                            style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground pt-2">
                      {person.relationshipInsight?.initiativeBalance !== undefined && (
                        <>Balance: <span className="font-medium">
                          {person.relationshipInsight.initiativeBalance > 0.2
                            ? "You initiate more"
                            : person.relationshipInsight.initiativeBalance < -0.2
                            ? "They initiate more"
                            : "Well balanced"}
                        </span></>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Closeness Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ClosenessChart data={closenessTimeline} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="places" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Shared Locations</CardTitle>
            </CardHeader>
            <CardContent>
              {topLocations.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p className="text-3xl mb-2">📍</p>
                  <p className="text-sm font-medium">No locations logged yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topLocations.map(([location, count], index) => (
                    <div key={location} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <p className="text-sm font-medium truncate">{location}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {count} {count === 1 ? "visit" : "visits"} together
                        </p>
                      </div>
                      <Link href={`/map?personId=${person.id}`}>
                        <Badge variant="outline" className="text-xs shrink-0">View on map</Badge>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
