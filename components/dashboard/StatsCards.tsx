import { Users, Activity, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string | number;
  subtext: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

interface StatsCardsProps {
  totalPeople: number;
  totalActivities: number;
  activitiesThisMonth: number;
  averageCloseness: number;
}

export function StatsCards({
  totalPeople,
  totalActivities,
  activitiesThisMonth,
  averageCloseness,
}: StatsCardsProps) {
  const stats: Stat[] = [
    {
      label: "People Tracked",
      value: totalPeople,
      subtext: "in your circle",
      icon: Users,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      label: "Total Interactions",
      value: totalActivities,
      subtext: "all time",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "This Month",
      value: activitiesThisMonth,
      subtext: "interactions logged",
      icon: Clock,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Avg Closeness",
      value: `${Math.round(averageCloseness)}`,
      subtext: "across all relationships",
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="transition-card hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
              </div>
              <div className={cn("p-2.5 rounded-lg", stat.bgColor)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
