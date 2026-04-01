"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MOOD_COLORS, MOOD_LABELS } from "@/types";
import type { Mood } from "@/types";
import type { Activity } from "@prisma/client";

interface MoodDistributionChartProps {
  activities: Activity[];
}

export function MoodDistributionChart({ activities }: MoodDistributionChartProps) {
  const counts: Partial<Record<Mood, number>> = {};
  activities.forEach((a) => {
    counts[a.mood] = (counts[a.mood] ?? 0) + 1;
  });

  const data = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([mood, count]) => ({
      name: MOOD_LABELS[mood as Mood],
      value: count,
      color: MOOD_COLORS[mood as Mood],
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        No mood data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(val, name) => [val, name]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
