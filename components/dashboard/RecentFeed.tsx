import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import { formatRelativeDate, getInitials } from "@/lib/utils";
import { MOOD_COLORS, MOOD_LABELS, ACTIVITY_ICONS, ACTIVITY_LABELS } from "@/types";
import type { ActivityWithPerson } from "@/types";

interface RecentFeedProps {
  activities: ActivityWithPerson[];
}

export function RecentFeed({ activities }: RecentFeedProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            <p className="text-4xl mb-3">💬</p>
            <p className="font-medium">No interactions yet</p>
            <p className="text-sm mt-1">Start by logging your first interaction.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Interactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={`/people/${activity.personId}`}
              className="flex items-start gap-4 px-6 py-4 hover:bg-muted/50 transition-colors group"
            >
              <Avatar className="h-9 w-9 mt-0.5 shrink-0">
                <AvatarImage src={activity.person.avatarUrl ?? undefined} />
                <AvatarFallback className="text-xs">
                  {getInitials(activity.person.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {activity.person.name}
                  </p>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatRelativeDate(activity.date)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {ACTIVITY_ICONS[activity.activityType]}{" "}
                  {ACTIVITY_LABELS[activity.activityType]}
                  {activity.locationName && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" />
                      {activity.locationName}
                    </span>
                  )}
                </p>
                {activity.notes && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {activity.notes}
                  </p>
                )}
              </div>
              <div
                className="w-2 h-2 rounded-full mt-2 shrink-0"
                style={{ backgroundColor: MOOD_COLORS[activity.mood] }}
                title={MOOD_LABELS[activity.mood]}
              />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
