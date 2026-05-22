// SectorSummary.tsx
// same table as above but repeated under each sector heading
// assignment wanted stocks grouped by sector with totals on top

"use client";

import type { SectorSummary as SectorGroup } from "@/types/portfolio";
import { formatRupee, getGainLossColor } from "@/utils/formatters";
import { PortfolioTable } from "./PortfolioTable";

export function SectorSummary({ sectors }: { sectors: SectorGroup[] }) {
  return (
    <div className="space-y-5">
      {sectors.map((sector) => (
        <div key={sector.sector}>
          {/* dark bar = sector name + that sectors totals */}
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2 rounded-lg bg-slate-800 px-4 py-3 text-white">
            <h3 className="text-lg font-semibold">{sector.sector}</h3>
            <div className="flex gap-5 text-sm">
              <span>
                Invested {formatRupee(sector.totalInvestment)} · Now{" "}
                {formatRupee(sector.totalPresentValue)}
              </span>
              <span className={getGainLossColor(sector.gainLoss)}>
                P/L {formatRupee(sector.gainLoss)}
              </span>
            </div>
          </div>
          <PortfolioTable rows={sector.holdings} />
        </div>
      ))}
    </div>
  );
}
