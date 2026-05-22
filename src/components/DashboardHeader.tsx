// DashboardHeader.tsx (PortfolioStats)
// the 4 boxes on top - total invested, current value, profit/loss, last updated time

import type { PortfolioData } from "@/types/portfolio";
import { formatRupee, getGainLossColor } from "@/utils/formatters";

export function PortfolioStats({
  data,
  lastUpdated,
  isRefreshing,
}: {
  data: PortfolioData;
  lastUpdated: string | null;
  isRefreshing: boolean;
}) {
  const { totals } = data;
  const updatedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })
    : "-";

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox label="Total invested" value={formatRupee(totals.totalInvestment)} />
        <StatBox label="Current value" value={formatRupee(totals.totalPresentValue)} />
        <StatBox
          label="Profit / Loss"
          value={formatRupee(totals.gainLoss)}
          valueClass={getGainLossColor(totals.gainLoss)}
        />
        <StatBox
          label="Last updated"
          value={updatedTime}
          hint={isRefreshing ? "Updating…" : "Updates every 15 seconds"}
        />
      </div>
      {data.note && (
        <p className="text-xs text-slate-500">
          {data.note}
          {data.cached ? " (from cache)" : ""}
        </p>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  hint,
  valueClass,
}: {
  label: string;
  value: string;
  hint?: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${valueClass ?? ""}`}>{value}</div>
      {hint && <div className="mt-0.5 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}
