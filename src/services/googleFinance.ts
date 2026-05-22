// googleFinance.ts
// backup when yahoo does not give P/E or earnings
// assignment said use google for those - but google page is hard to scrape
// so this might return null often, thats ok

import type { Exchange } from "@/types/portfolio";

const browserUserAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function getGoogleSymbol(symbol: string, exchange: Exchange) {
  // google uses NSE:SYMBOL or BOM:number for BSE
  if (exchange === "BSE" || /^\d+$/.test(symbol)) return `BOM:${symbol}`;
  return `NSE:${symbol}`;
}

export async function fetchFromGoogle(
  symbol: string,
  exchange: Exchange
): Promise<{ peRatio: number | null; latestEarnings: number | null }> {
  const googleSymbol = getGoogleSymbol(symbol, exchange);
  const url = `https://www.google.com/finance/quote/${encodeURIComponent(googleSymbol)}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": browserUserAgent, "Accept-Language": "en-IN,en;q=0.9" },
    });
    if (!response.ok) return { peRatio: null, latestEarnings: null };

    const html = await response.text();

    // trying to find numbers inside the page HTML (not a real API)
    const peMatch = html.match(/"P\/E ratio"[^}]*?"value"\s*:\s*"?([\d.]+)/i);
    const earningsMatch = html.match(/"EPS"[^}]*?"value"\s*:\s*"?([\d.]+)/i);

    return {
      peRatio: peMatch ? parseFloat(peMatch[1]) : null,
      latestEarnings: earningsMatch ? parseFloat(earningsMatch[1]) : null,
    };
  } catch {
    return { peRatio: null, latestEarnings: null };
  }
}
