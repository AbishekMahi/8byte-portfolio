// portfolioService.ts
// this is the "brain" - reads my stock list, gets live prices, builds table rows
// API route calls buildPortfolioData() and sends result to browser

import holdingsJson from "@/data/portfolio.json";
import type { Holding, PortfolioData, PortfolioRow, StockPrices } from "@/types/portfolio";
import {
  getCurrentValue,
  getInvestment,
  getPortfolioWeight,
  getProfitLoss,
} from "@/utils/calculations";
import { getOverallTotals, groupBySector } from "@/utils/grouping";
import { fetchAllStocks } from "./yahooFinance";

const holdings = holdingsJson as Holding[];

// merge static stock info + live prices into one table row
function buildStockRow(
  stock: Holding,
  prices: StockPrices,
  totalInvestment: number
): PortfolioRow {
  const investment = getInvestment(stock.purchasePrice, stock.qty);
  const currentValue = getCurrentValue(prices.cmp, stock.qty);

  return {
    id: stock.id,
    particulars: stock.particulars,
    symbol: stock.symbol,
    purchasePrice: stock.purchasePrice,
    qty: stock.qty,
    investment,
    portfolioPct: getPortfolioWeight(investment, totalInvestment),
    exchangeCode: stock.symbol,
    sector: stock.sector,
    cmp: prices.cmp,
    presentValue: currentValue,
    gainLoss: getProfitLoss(currentValue, investment),
    peRatio: prices.peRatio,
    latestEarnings: prices.latestEarnings,
  };
}

export async function buildPortfolioData(): Promise<PortfolioData> {
  // step 1 - how much i invested in total (for % column)
  const totalInvestment = holdings.reduce(
    (sum, stock) => sum + getInvestment(stock.purchasePrice, stock.qty),
    0
  );

  // step 2 - yahoo (this takes time - 26 stocks)
  const livePrices = await fetchAllStocks(holdings);

  // step 3 - build each row
  const rows = holdings.map((stock) => {
    const prices = livePrices.get(stock.id) ?? {
      cmp: null,
      peRatio: null,
      latestEarnings: null,
      yahooSymbol: "",
      failed: true,
    };
    return buildStockRow(stock, prices, totalInvestment);
  });

  return {
    rows,
    sectors: groupBySector(rows),
    totals: getOverallTotals(rows),
    fetchedAt: new Date().toISOString(),
    cached: false,
    note: "Prices from Yahoo. P/E and earnings from Yahoo too, with Google as backup when needed.",
  };
}
