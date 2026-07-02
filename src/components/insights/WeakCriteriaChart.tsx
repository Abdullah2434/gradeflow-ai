"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeakCriterion } from "@/store/services/insights/insightsApi";

export function WeakCriteriaChart({ data }: { data: WeakCriterion[] }) {
  const chartData = data.map((d) => ({
    name: d.criterion.length > 18 ? `${d.criterion.slice(0, 18)}…` : d.criterion,
    fullName: d.criterion,
    average: Math.round(d.average * 10) / 10,
    max: d.max,
    pct: Math.round(d.pct),
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" tick={{ fill: "var(--ink-muted)", fontSize: 12 }} />
          <YAxis tick={{ fill: "var(--ink-muted)", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
            formatter={(value, _name, item) => [
              `${value} / ${(item.payload as { max: number }).max}`,
              (item.payload as { fullName: string }).fullName,
            ]}
          />
          <Bar dataKey="average" fill="var(--accent)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
