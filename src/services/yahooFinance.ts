// yahooFinance.ts - fetches live CMP, P/E, earnings for all holdings

import type { Holding, StockPrices } from "@/types/portfolio";
import { fetchFromGoogle } from "./googleFinance";
import {
  fetchPriceFromChart,
  fetchYahooBatchInProcess,
  getYahooSymbol,
} from "./yahooBatchCore";

export { getYahooSymbol };

const STOCKS_PER_BATCH = 8;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function addGoogleDataIfMissing(stock: Holding, prices: StockPrices) {
  if (prices.peRatio != null && prices.latestEarnings != null) return prices;

  const google = await fetchFromGoogle(stock.symbol, stock.exchange);
  return {
    ...prices,
    peRatio: prices.peRatio ?? google.peRatio,
    latestEarnings: prices.latestEarnings ?? google.latestEarnings,
  };
}

export async function fetchOneStock(stock: Holding): Promise<StockPrices> {
  const yahooSymbol = getYahooSymbol(stock.symbol, stock.exchange);
  const cmp = await fetchPriceFromChart(yahooSymbol);

  const prices: StockPrices = {
    yahooSymbol,
    cmp,
    peRatio: null,
    latestEarnings: null,
    failed: cmp == null,
  };

  return addGoogleDataIfMissing(stock, prices);
}

export async function fetchAllStocks(stocks: Holding[]) {
  const allPrices = new Map<number, StockPrices>();

  try {
    for (let i = 0; i < stocks.length; i += STOCKS_PER_BATCH) {
      const batch = stocks.slice(i, i + STOCKS_PER_BATCH);
      const batchPrices = await fetchYahooBatchInProcess(batch);

      for (const stock of batch) {
        const prices = batchPrices.get(stock.id);
        if (prices) {
          allPrices.set(stock.id, await addGoogleDataIfMissing(stock, prices));
        }
      }

      if (i + STOCKS_PER_BATCH < stocks.length) await wait(400);
    }
    return allPrices;
  } catch (error) {
    console.error("Yahoo fetch failed, using chart prices only", error);
  }

  for (const stock of stocks) {
    allPrices.set(stock.id, await fetchOneStock(stock));
    await wait(200);
  }
  return allPrices;
}
