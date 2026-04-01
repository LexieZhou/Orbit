import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { getInitials } from "@/lib/utils";
import type { PersonWithInsight } from "@/types";

interface TopPeopleProps {
  people: PersonWithInsight[];
}

function TrendIcon({ direction }: { direction: string }) {
  if (direction === "up") return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
  if (direction === "down") return <TrendingDown className="h-3.5 w-3.5 text-rose-500" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

export function TopPeople({ people }: TopPeopleProps) {
  const sorted = [...people]
    .filter((p) => p.relationshipInsight)
    .sort((a, b) => (b.relationshipInsight?.closenessScore ?? 0) - (a.relationshipInsight?.closenessScore ?? 0))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Relationship Strength</CardTitle>
          <Link href="/people" className="text-xs text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sorted.map((person) => {
          const score = person.relationshipInsight?.closenessScore ?? 0;
          const trend = person.relationshipInsight?.trendDirection ?? "steady";
          return (
            <Link key={person.id} href={`/people/${person.id}`} className="block group">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={person.avatarUrl ?? undefined} />
                  <AvatarFallback className="text-xs">{getInitials(person.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                      {person.name}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <TrendIcon direction={trend} />
                      <span className="text-xs font-semibold text-muted-foreground">
                        {Math.round(score)}
                      </span>
                    </div>
                  </div>
                  <Progress value={score} className="h-1.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
