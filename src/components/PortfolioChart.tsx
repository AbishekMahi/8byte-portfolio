// PortfolioChart.tsx
// bar chart - invested vs current value per sector
// we wait for "mounted" because recharts was crying about width -1 on server render

"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SectorSummary } from "@/types/portfolio";

const CHART_H = 280; // fixed height fixes the recharts warning

export function PortfolioChart({ sectors }: { sectors: SectorSummary[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = sectors.map((s) => ({
    name: s.sector,
    invested: Math.round(s.totalInvestment),
    current: Math.round(s.totalPresentValue),
  }));

  if (!chartData.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="mb-3 text-sm font-medium text-slate-700">Sector breakdown</p>
      <div className="w-full min-w-0" style={{ height: CHART_H, minHeight: CHART_H }}>
        {mounted ? (
          <ResponsiveContainer width="100%" height={CHART_H} debounce={50}>
            <BarChart data={chartData} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />
              <Legend />
              <Bar dataKey="invested" name="Invested" fill="#475569" />
              <Bar dataKey="current" name="Current" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div
            className="flex items-center justify-center text-sm text-slate-400"
            style={{ height: CHART_H }}
          >
            Loading chart…
          </div>
        )}
      </div>
    </div>
  );
}
