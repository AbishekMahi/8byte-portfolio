// Yahoo Finance - runs inside the API route (local + Vercel via serverExternalPackages)

import YahooFinance from "yahoo-finance2";
import type { Exchange, Holding, StockPrices } from "@/types/portfolio";

// instance has .quote / .quoteSummary at runtime; base class types hide them
interface YahooClient {
  quote(symbol: string): Promise<unknown>;
  quoteSummary(
    symbol: string,
    options: { modules: string[] }
  ): Promise<{
    summaryDetail?: { trailingPE?: number; trailingEps?: number };
    defaultKeyStatistics?: { forwardPE?: number; trailingEps?: number };
  }>;
}

const YahooFinanceCtor = YahooFinance as unknown as new (options?: {
  suppressNotices?: string[];
}) => YahooClient;

const browserUserAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

let yahooClient: YahooClient | null = null;

function getYahooClient() {
  if (!yahooClient) {
    yahooClient = new YahooFinanceCtor({ suppressNotices: ["yahooSurvey"] });
  }
  return yahooClient;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function getYahooSymbol(symbol: string, exchange: Exchange) {
  if (exchange === "BSE" || /^\d+$/.test(symbol)) return `${symbol}.BO`;
  return `${symbol}.NS`;
}

export async function fetchPriceFromChart(yahooSymbol: string): Promise<number | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`;
  const response = await fetch(url, {
    headers: { "User-Agent": browserUserAgent },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const json = await response.json();
  const price = json?.chart?.result?.[0]?.meta?.regularMarketPrice;
  return typeof price === "number" ? price : null;
}

async function fetchOneFromYahoo(
  stock: Pick<Holding, "id" | "symbol" | "exchange">,
  yf: YahooClient
): Promise<StockPrices> {
  const yahooSymbol = getYahooSymbol(stock.symbol, stock.exchange);
  let cmp: number | null = null;
  let peRatio: number | null = null;
  let latestEarnings: number | null = null;

  try {
    const raw = await yf.quote(yahooSymbol);
    const q = Array.isArray(raw) ? raw[0] : raw;
    if (q && typeof q === "object") {
      const row = q as Record<string, unknown>;
      cmp = num(row.regularMarketPrice);
      peRatio = num(row.trailingPE) ?? num(row.forwardPE);
      latestEarnings =
        num(row.epsTrailingTwelveMonths) ?? num(row.epsForward) ?? num(row.epsCurrentYear);
    }
  } catch {
    console.error(`Yahoo quote failed for ${yahooSymbol}`);
  }

  if (peRatio == null || latestEarnings == null) {
    try {
      const sum = await yf.quoteSummary(yahooSymbol, {
        modules: ["summaryDetail", "defaultKeyStatistics"],
      });
      peRatio ??=
        num(sum.summaryDetail?.trailingPE) ?? num(sum.defaultKeyStatistics?.forwardPE);
      latestEarnings ??=
        num(sum.defaultKeyStatistics?.trailingEps) ?? num(sum.summaryDetail?.trailingEps);
    } catch {
      console.error(`Yahoo summary failed for ${yahooSymbol}`);
    }
  }

  if (cmp == null) cmp = await fetchPriceFromChart(yahooSymbol);

  return {
    yahooSymbol,
    cmp,
    peRatio,
    latestEarnings,
    failed: cmp == null,
  };
}

export async function fetchYahooBatchInProcess(
  stocks: Pick<Holding, "id" | "symbol" | "exchange">[]
): Promise<Map<number, StockPrices>> {
  const yf = getYahooClient();
  const result = new Map<number, StockPrices>();

  for (const stock of stocks) {
    result.set(stock.id, await fetchOneFromYahoo(stock, yf));
    await sleep(350);
  }

  return result;
}
