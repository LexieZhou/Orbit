import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  closenessLabel,
  closenessColor,
  daysSince,
  getInitials,
} from "@/lib/utils";
import {
  RELATIONSHIP_LABELS,
  RELATIONSHIP_COLORS,
} from "@/types";
import type { PersonWithInsight } from "@/types";
import { ChatButton } from "@/components/people/ChatModal";

interface PersonCardProps {
  person: PersonWithInsight;
}

function TrendBadge({ direction }: { direction: string }) {
  if (direction === "up")
    return (
      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
        <TrendingUp className="h-3 w-3" /> Growing
      </span>
    );
  if (direction === "down")
    return (
      <span className="flex items-center gap-1 text-xs text-rose-500 font-medium">
        <TrendingDown className="h-3 w-3" /> Fading
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
      <Minus className="h-3 w-3" /> Steady
    </span>
  );
}

export function PersonCard({ person }: PersonCardProps) {
  const insight = person.relationshipInsight;
  const score = insight?.closenessScore ?? 0;
  const days = daysSince(insight?.lastInteractionDate ?? null);

  return (
    <Link href={`/people/${person.id}`}>
      <Card className="h-full transition-card hover:shadow-md hover:-translate-y-0.5 cursor-pointer relative">
        {/* DM chat button */}
        <ChatButton person={person} />

        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src={person.avatarUrl ?? undefined} />
              <AvatarFallback className="text-sm">{getInitials(person.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{person.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: RELATIONSHIP_COLORS[person.relationshipType] }}
                />
                <span className="text-xs text-muted-foreground">
                  {RELATIONSHIP_LABELS[person.relationshipType]}
                </span>
              </div>
            </div>
          </div>

          {/* Score */}
          {insight ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${closenessColor(score)}`}>
                  {closenessLabel(score)}
                </span>
                <TrendBadge direction={insight.trendDirection} />
              </div>
              <Progress value={score} className="h-1.5" />
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
                <span>
                  {insight.interactionCount30d} this month
                </span>
                {days !== null && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {days === 0 ? "Today" : `${days}d ago`}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No interactions yet</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
