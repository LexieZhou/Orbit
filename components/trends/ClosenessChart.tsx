"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format, parseISO } from "date-fns";

interface DataPoint {
  date: string;
  score: number;
}

interface ClosenessChartProps {
  data: DataPoint[];
}

export function ClosenessChart({ data }: ClosenessChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Not enough data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="closenessGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(250, 84%, 60%)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="hsl(250, 84%, 60%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(v) => {
            try { return format(parseISO(v), "MMM"); } catch { return v; }
          }}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(val) => [`${val}`, "Closeness"]}
          labelFormatter={(l) => {
            try { return format(parseISO(l as string), "MMM d, yyyy"); } catch { return l; }
          }}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="hsl(250, 84%, 60%)"
          strokeWidth={2}
          fill="url(#closenessGrad)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
