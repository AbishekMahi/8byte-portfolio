// route.ts - API entry point
// browser calls GET /api/portfolio
// this file checks cache first, else calls buildPortfolioData()

import { NextRequest, NextResponse } from "next/server";
import { buildPortfolioData } from "@/services/portfolioService";
import { getCachedData, removeFromCache, saveToCache } from "@/services/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // 26 yahoo calls need more than default 10s on Vercel

const CACHE_KEY = "portfolio";
const CACHE_TIME_MS = 15000; // same as frontend refresh - 15 sec

export async function GET(request: NextRequest) {
  // ?refresh=true clears cache - use when testing or prices look wrong
  if (request.nextUrl.searchParams.get("refresh") === "true") {
    removeFromCache(CACHE_KEY);
  }

  const cached = getCachedData<Awaited<ReturnType<typeof buildPortfolioData>>>(CACHE_KEY);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  try {
    const portfolio = await buildPortfolioData();

    // only cache if atleast one stock got a price (dont save all-empty response)
    const hasAnyPrice = portfolio.rows.some((row) => row.cmp != null);
    if (hasAnyPrice) saveToCache(CACHE_KEY, portfolio, CACHE_TIME_MS);

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Portfolio API error:", error);
    return NextResponse.json({ error: "Could not load portfolio" }, { status: 500 });
  }
}
