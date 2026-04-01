import Link from "next/link";
import { AlertCircle, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, getInitials } from "@/lib/utils";
import type { ReminderItem } from "@/types";

interface ReminderListProps {
  reminders: ReminderItem[];
  compact?: boolean;
}

const PRIORITY_STYLES = {
  high: "border-l-rose-400",
  medium: "border-l-amber-400",
  low: "border-l-blue-400",
};

const PRIORITY_BADGE: Record<string, "danger" | "warning" | "secondary"> = {
  high: "danger",
  medium: "warning",
  low: "secondary",
};

export function ReminderList({ reminders, compact = false }: ReminderListProps) {
  const displayed = compact ? reminders.slice(0, 3) : reminders;

  if (reminders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-3xl mb-2">✨</p>
            <p className="text-sm font-medium">All caught up!</p>
            <p className="text-xs mt-1">Your relationships are looking healthy.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Reminders
          </CardTitle>
          {compact && reminders.length > 3 && (
            <Link
              href="/reminders"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all ({reminders.length}) <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {displayed.map((reminder) => (
            <Link
              key={reminder.personId}
              href={`/people/${reminder.personId}`}
              className={cn(
                "flex items-start gap-4 px-6 py-4 hover:bg-muted/50 transition-colors border-l-4 group",
                PRIORITY_STYLES[reminder.priority]
              )}
            >
              <Avatar className="h-9 w-9 mt-0.5 shrink-0">
                <AvatarImage src={reminder.avatarUrl ?? undefined} />
                <AvatarFallback className="text-xs">
                  {getInitials(reminder.personName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {reminder.personName}
                  </p>
                  <Badge variant={PRIORITY_BADGE[reminder.priority]} className="shrink-0 capitalize">
                    {reminder.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {reminder.message}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
