// types/portfolio.ts
// all the shapes (types) used in this project - like a blueprint for data
// when recruiter asks "what is PortfolioRow" - its one row in the table

export type Exchange = "NSE" | "BSE";

// one stock from my excel / portfolio.json (static data - does not change every 15 sec)
export interface Holding {
  id: number;
  particulars: string;
  symbol: string;
  purchasePrice: number;
  qty: number;
  sector: string;
  exchange: Exchange;
}

// live prices we got from yahoo (or google backup) for one stock
// see FINANCE_TERMS.md in project root if confused:
//   cmp = CMP = current price of 1 share right now
//   peRatio = P/E ratio (investor metric, optional)
//   latestEarnings = earnings per share in rupees (optional)
export interface StockPrices {
  cmp: number | null;
  peRatio: number | null;
  latestEarnings: number | null;
  yahooSymbol: string; // like HDFCBANK.NS
  failed?: boolean; // true when yahoo couldnt give price
}

// one full row for the table - static + calculated + live fields together
export interface PortfolioRow {
  id: number;
  particulars: string;
  symbol: string;
  purchasePrice: number;
  qty: number;
  investment: number;
  portfolioPct: number;
  exchangeCode: string;
  sector: string;
  cmp: number | null;
  presentValue: number | null;
  gainLoss: number | null;
  peRatio: number | null;
  latestEarnings: number | null;
}

// sector block - list of stocks in that sector + totals on top
export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
  holdings: PortfolioRow[];
}

// whole thing API sends to browser - table rows + sectors + grand totals
export interface PortfolioData {
  rows: PortfolioRow[];
  sectors: SectorSummary[];
  totals: {
    totalInvestment: number;
    totalPresentValue: number;
    gainLoss: number;
  };
  fetchedAt: string;
  cached: boolean;
  note?: string;
}
