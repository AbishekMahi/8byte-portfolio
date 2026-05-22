# Application architecture

**Candidate:** Abishek M  
**Assignment:** 8byte Full Stack - Dynamic Portfolio Dashboard

This document explains how I structured the project and how data moves through the system. I have tried to keep it simple so its easier to follow in the Loom video or if you have questions in the next round.

For definitions of terms like CMP, P/E ratio, and gain/loss, please see **[FINANCE_TERMS.md](./FINANCE_TERMS.md)**.

---

## Overview

The application reads a fixed list of stock holdings from a JSON file (derived from the Excel sheet). On each request, the server fetches live prices and related fields from Yahoo Finance, calculates derived columns (investment, present value, gain/loss, portfolio percentage), groups rows by sector, and returns the result to the browser. The UI refreshes this data every 15 seconds.

---

## Data flow

```

Excel (provided)  →  portfolio.json  (static holdings)
                           ↓
                  GET /api/portfolio  (Next.js API route)
                           ↓
              yahooBatchCore.ts  (live market data, in-process)
                           ↓
              portfolioService + calculations + grouping
                           ↓
                    JSON response
                           ↓
              React dashboard (table, chart, sector views)

```

---

## Design decisions

### Server-side market data

I fetch Yahoo and Google data only from the server, not from the browser. This avoids CORS restrictions, keeps credentials and retry logic on the backend, and allows a short in-memory cache (15 seconds) so we do not overload Yahoo with repeated calls.

### Yahoo Finance (in-process)

Live quotes run in `src/services/yahooBatchCore.ts` inside the API route, with `serverExternalPackages: ["yahoo-finance2"]` in `next.config.ts`. An earlier approach used a separate `scripts/yahoo-batch.js` child process; that was removed because Vercel serverless could not load `yahoo-finance2` from `/var/task/scripts`.

### Single Next.js application

The assignment mentioned a Node backend and React frontend. I implemented both using Next.js: API routes act as the backend, and React components form the frontend. This simplifies deployment on Vercel while still using Node.js on the server for Yahoo and caching.

### Static holdings file

The Excel file is converted once to `portfolio.json`. The app does not parse `.xlsx` at runtime. Holdings (name, symbol, buy price, quantity, sector, exchange) are stable; only market prices change live.

---

## Column calculations

| Column | Meaning | Formula |
| -------- | --------- | --------- |
| Investment | Total amount spent on that holding | Purchase price × quantity |
| Present value | Current worth at live price | CMP × quantity |
| Gain / Loss | Difference vs amount invested | Present value − investment |
| Portfolio % | Share of total portfolio by investment | (Stock investment ÷ total investment) × 100 |

Implementation: `src/utils/calculations.ts`.

---

## Suggested order for code walkthrough (Loom)

1. `src/data/portfolio.json` - source data  
2. `src/app/api/portfolio/route.ts` - API and caching  
3. `src/services/yahooBatchCore.ts` - Yahoo Finance (main path)  
4. `src/services/yahooFinance.ts` - batching, Google backup  
5. `src/services/portfolioService.ts` - row building  
6. `src/hooks/usePortfolio.ts` - 15-second refresh  
7. `src/components/PortfolioLoader.tsx` + table / chart / sectors  
8. Live demo (local or Vercel)  

---

## Known limitations

- Some symbols (e.g. LTIM) may not return data from Yahoo; the UI shows a dash instead of failing.  
- Live CMP will differ from values frozen in the Excel snapshot because the market moves daily.  
- Yahoo and Google are unofficial data sources; a production system would typically use a licensed market data API.  
- First full load is slower because 26 stocks are fetched in batches of eight with a short delay between batches.

---

## Technology stack

- **Framework:** Next.js (App Router)  
- **Language:** TypeScript  
- **UI:** React, Tailwind CSS  
- **Table:** TanStack Table  
- **Chart:** Recharts  
- **Market data:** yahoo-finance2, Yahoo chart API, optional Google Finance scrape  

---

If you have questions about any layer of this design, I can go into more detail in the interview.

Abishek M
