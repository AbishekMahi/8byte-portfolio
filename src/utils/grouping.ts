// grouping.ts
// takes flat list of stocks and groups them by sector (IT, Bank, etc)
// also adds up totals per sector and for whole portfolio

import type { PortfolioRow, SectorSummary } from "@/types/portfolio";
import { getProfitLoss } from "./calculations";

export function groupBySector(rows: PortfolioRow[]): SectorSummary[] {
  const sectorMap: Record<string, PortfolioRow[]> = {};

  // put each row into bucket by sector name
  for (const row of rows) {
    if (!sectorMap[row.sector]) sectorMap[row.sector] = [];
    sectorMap[row.sector].push(row);
  }

  return Object.entries(sectorMap).map(([sector, holdings]) => {
    let totalInvestment = 0;
    let totalPresentValue = 0;

    for (const stock of holdings) {
      totalInvestment += stock.investment;
      totalPresentValue += stock.presentValue ?? 0;
    }

    return {
      sector,
      holdings,
      totalInvestment,
      totalPresentValue,
      gainLoss: getProfitLoss(totalPresentValue, totalInvestment) ?? 0,
    };
  });
}

export function getOverallTotals(rows: PortfolioRow[]) {
  // top cards on dashboard - sum of everything
  let totalInvestment = 0;
  let totalPresentValue = 0;

  for (const row of rows) {
    totalInvestment += row.investment;
    totalPresentValue += row.presentValue ?? 0;
  }

  return {
    totalInvestment,
    totalPresentValue,
    gainLoss: getProfitLoss(totalPresentValue, totalInvestment) ?? 0,
  };
}
