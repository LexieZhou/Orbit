import Link from "next/link";
import { PlusCircle, TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

interface PersonHeaderProps {
  person: PersonWithInsight;
}

function TrendChip({ direction }: { direction: string }) {
  if (direction === "up")
    return (
      <Badge variant="success" className="gap-1">
        <TrendingUp className="h-3 w-3" /> Growing
      </Badge>
    );
  if (direction === "down")
    return (
      <Badge variant="danger" className="gap-1">
        <TrendingDown className="h-3 w-3" /> Fading
      </Badge>
    );
  return (
    <Badge variant="secondary" className="gap-1">
      <Minus className="h-3 w-3" /> Steady
    </Badge>
  );
}

export function PersonHeader({ person }: PersonHeaderProps) {
  const insight = person.relationshipInsight;
  const score = insight?.closenessScore ?? 0;
  const days = daysSince(insight?.lastInteractionDate ?? null);

  return (
    <div className="bg-card border rounded-xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Avatar */}
        <Avatar className="h-20 w-20 shrink-0 text-2xl">
          <AvatarImage src={person.avatarUrl ?? undefined} />
          <AvatarFallback className="text-xl">{getInitials(person.name)}</AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">{person.name}</h2>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: RELATIONSHIP_COLORS[person.relationshipType] }}
              />
              <span className="text-sm text-muted-foreground">
                {RELATIONSHIP_LABELS[person.relationshipType]}
              </span>
            </div>
            {insight && <TrendChip direction={insight.trendDirection} />}
          </div>

          {person.notes && (
            <p className="text-sm text-muted-foreground mb-3 max-w-lg">{person.notes}</p>
          )}

          {insight && (
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Closeness: </span>
                <span className={`font-semibold ${closenessColor(score)}`}>
                  {closenessLabel(score)} ({Math.round(score)}/100)
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">This month: </span>
                <span className="font-semibold">
                  {insight.interactionCount30d} interactions
                </span>
              </div>
              {days !== null && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Last seen: </span>
                  <span className="font-semibold">
                    {days === 0 ? "Today" : `${days} days ago`}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="shrink-0">
          <Link href={`/activities/new?personId=${person.id}`}>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Log Interaction
            </Button>
          </Link>
        </div>
      </div>

      {/* Closeness bar */}
      {insight && (
        <div className="mt-5 pt-5 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Relationship Strength</span>
            <span className={`text-xs font-bold ${closenessColor(score)}`}>
              {Math.round(score)} / 100
            </span>
          </div>
          <Progress value={score} className="h-2" />
        </div>
      )}
    </div>
  );
}
