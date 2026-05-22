// Dashboard.tsx
// main screen - uses hook to get data, then shows stats + chart + table + sectors

"use client";

import { usePortfolio } from "@/hooks/usePortfolio";
import { PortfolioStats } from "./DashboardHeader";
import { PortfolioChart } from "./PortfolioChart";
import { PortfolioTable } from "./PortfolioTable";
import { SectorSummary } from "./SectorSummary";
import { PortfolioLoader } from "./PortfolioLoader";

export function Dashboard() {
  const { portfolio, loading, isRefreshing, errorMessage, lastUpdated, retryLoad } =
    usePortfolio();

  if (loading && !portfolio) {
    return <PortfolioLoader />;
  }

  if (errorMessage && !portfolio) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">
        <p className="font-medium">Could not load portfolio</p>
        <p className="mt-1 text-sm">{errorMessage}</p>
        <button
          type="button"
          onClick={retryLoad}
          className="mt-3 rounded bg-red-700 px-3 py-1.5 text-sm text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!portfolio) return null;

  return (
    <div className="space-y-8">
      <PortfolioStats
        data={portfolio}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
      />

      <PortfolioChart sectors={portfolio.sectors} />

      <section>
        <h2 className="mb-3 text-lg font-semibold">All stocks</h2>
        <PortfolioTable rows={portfolio.rows} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Grouped by sector</h2>
        <SectorSummary sectors={portfolio.sectors} />
      </section>
    </div>
  );
}
