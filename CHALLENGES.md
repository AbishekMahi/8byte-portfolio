# Technical challenges and solutions

**Candidate:** Abishek M  
**Assignment:** 8byte Full Stack - Portfolio Dashboard

Dear team,

As requested in the assignment email, I am sharing the main difficulties I faced while building this project and how I addressed them. I have written this in simple language so it is easy to review; technical terms are explained briefly where needed. A glossary of finance words (CMP, P/E, etc.) is in **[FINANCE_TERMS.md](./FINANCE_TERMS.md)**.

---

## 1. Live prices were not showing at first

**Problem:** When I first connected Yahoo Finance, the table showed empty values (dashes) for CMP, P/E ratio, and earnings.

**Cause:** Inside Next.js, the Yahoo library often returned `429 Too Many Requests`. I could still get a price from Yahoo’s public chart URL, but that endpoint does not include P/E or earnings.

**Solution:**
- Upgraded to `yahoo-finance2` version 3  
- Added `scripts/yahoo-batch.js` and call it from the API with Node’s `child_process`, so Yahoo runs outside the Next bundle  
- Fallback to the chart URL for price only if the script fails  
- I dont cache responses when no stock has a valid price (so we dont show wrong empty data again)  

After deploying or restarting locally, use `/api/portfolio?refresh=true` and allow 1–2 minutes for the first full fetch.

---

## 2. CMP appeared but P/E and earnings stayed empty

**Problem:** Current market price (CMP) sometimes loaded, but the P/E and earnings columns remained blank.

**Cause:** Same root issue - the bundled Yahoo client failed silently in Next.js, and the chart fallback has no fundamental data.

**Solution:** The batch script uses `quote` and `quoteSummary` in plain Node. For example, HDFC Bank returns P/E around 17 and earnings per share around 45 when Yahoo responds. If Yahoo still misses a field, the server tries Google Finance as a backup.

---

## 3. No official free API for Yahoo or Google

**Problem:** The assignment asks for Yahoo (CMP) and Google (P/E and earnings). Neither provides a simple free official API for this use case.

**Solution:** I used the `yahoo-finance2` npm package and Yahoo’s chart endpoint, plus a best-effort fetch from Google Finance HTML when needed. In a production environment I would recommend a paid, licensed market data provider; I am happy to discuss that tradeoff in the interview.

---

## 4. Rate limiting with 26 stocks

**Problem:** Fetching all 26 symbols at once caused timeouts and errors.

**Solution:** The batch script processes eight stocks at a time with a short pause between each stock and between batches. The API caches the full portfolio response for 15 seconds - same as the UI refresh - so we dont hit Yahoo too often.

---

## 5. Converting Excel to application data

**Problem:** Reading `.xlsx` on every request would be slow and add dependencies.

**Solution:** I converted the holdings sheet once into `portfolio.json` (26 entries). NSE symbols are mapped to Yahoo as `SYMBOL.NS`; BSE numeric codes use `SYMBOL.BO`.

---

## 6. Slow first page load

**Problem:** The user must wait until all Yahoo calls complete before the table is useful.

**Solution:** I show a clear loading message (“first time can take 1–2 minutes”). With more time, I would render the table immediately with static columns and stream live prices row by row.

---

## 7. Chart console warning (Recharts)

**Problem:** The browser logged `width(-1) height(-1)` for the chart container.

**Cause:** Recharts was rendering before the container had a measurable size.

**Solution:** Render the chart only after the component mounts on the client, with a fixed height of 280px.

---

## 8. React hydration warning

**Problem:** Console warnings about mismatched HTML on `<html>` / `<body>`.

**Cause:** Browser extensions (e.g. Grammarly) inject attributes into the page.

**Solution:** Added `suppressHydrationWarning` on the root layout. This is an environment issue, not incorrect application logic.

---

## 9. Backend and frontend in one repository

**Problem:** The brief describes a Node backend and React frontend separately.

**Solution:** I used one Next.js project. The route `src/app/api/portfolio/route.ts` is the backend; React components are the frontend. Deployment to Vercel is straightforward and the architecture is still clearly separated by folders (`app/api`, `services`, `components`).

---

## 10. Vercel deployment - batch script could not find yahoo-finance2

**Problem:** On Vercel, `node scripts/yahoo-batch.js` failed with `Cannot find package 'yahoo-finance2'`. Only chart prices loaded (CMP), P/E and earnings were null.

**Cause:** Serverless bundle does not expose `node_modules` to a separate child process in `/var/task/scripts/`.

**Solution:** Added `src/services/yahooBatchCore.ts` to call Yahoo **inside** the API route (with `serverExternalPackages: ["yahoo-finance2"]`). On Vercel we always use in-process fetch; the script is only a fallback for local dev.

---

## 11. Node.js version and Yahoo library

**Problem:** `yahoo-finance2` v3 expects Node **22+**. On Node 20 the batch script may be killed and the app falls back to chart-only prices (P/E and earnings often missing).

**Solution:** Run and deploy with Node 22 or higher (`node -v`). I have noted this in the README. Locally I use nvm to switch versions when needed.

---

## 12. Missing data for some symbols

**Problem:** Not every holding returns complete data from Yahoo.

**Examples:**
- **LTIM** - no reliable price for the symbols I tried  
- **Savani Financials (BSE)** - P/E sometimes unavailable  
- Live CMP will not match old Excel figures because the market changes daily  

**Solution:** Show a dash (-) in the cell and continue; the rest of the portfolio still loads.

---

## Possible improvements (given more time)

- Progressive loading: show static table first, then update CMP per row  
- Redis or similar cache for production  
- Licensed market data API  
- Better symbol mapping for tickers that fail on Yahoo  

---

I implemented and tested this solution myself. I can walk through any file or decision in the Loom video or in the next interview round.

Thank you.

Abishek M
