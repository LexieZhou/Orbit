import { MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ACTIVITY_ICONS, ACTIVITY_LABELS, MOOD_COLORS, MOOD_LABELS } from "@/types";
import type { Activity } from "@prisma/client";

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-3xl mb-2">💬</p>
        <p className="text-sm font-medium">No interactions logged yet</p>
      </div>
    );
  }

  // Group by year-month
  const grouped: Record<string, Activity[]> = {};
  activities.forEach((a) => {
    const key = formatDate(a.date, "MMMM yyyy");
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(a);
  });

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([month, items]) => (
        <div key={month}>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {month}
          </h4>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
            <div className="space-y-4 pl-9">
              {items.map((activity) => (
                <div key={activity.id} className="relative">
                  {/* Dot */}
                  <div
                    className="absolute -left-9 top-1.5 w-4 h-4 rounded-full border-2 border-background"
                    style={{ backgroundColor: MOOD_COLORS[activity.mood] }}
                  />
                  <div className="bg-card border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{ACTIVITY_ICONS[activity.activityType]}</span>
                        <span className="font-medium text-sm">
                          {ACTIVITY_LABELS[activity.activityType]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: MOOD_COLORS[activity.mood] + "20",
                            color: MOOD_COLORS[activity.mood],
                          }}
                        >
                          {MOOD_LABELS[activity.mood]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(activity.date, "MMM d")}
                        </span>
                      </div>
                    </div>
                    {activity.locationName && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1.5">
                        <MapPin className="h-3 w-3" />
                        {activity.locationName}
                      </p>
                    )}
                    {activity.notes && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {activity.notes}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground/70 mt-2 capitalize">
                      Initiated by: {activity.initiatedBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
