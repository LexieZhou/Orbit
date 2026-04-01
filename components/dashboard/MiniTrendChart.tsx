"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

interface DataPoint {
  date: string;
  count: number;
}

interface MiniTrendChartProps {
  data: DataPoint[];
  title?: string;
}

export function MiniTrendChart({
  data,
  title = "Interaction Frequency",
}: MiniTrendChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(250, 84%, 60%)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(250, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <YAxis hide domain={[0, "auto"]} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(val) => [val, "Interactions"]}
              labelFormatter={(l) => {
                try { return format(parseISO(l as string), "MMM d, yyyy"); } catch { return l; }
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(250, 84%, 60%)"
              strokeWidth={2}
              fill="url(#areaGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
