// calculations.ts
// pure math only - no API, no react
// assignment columns like investment, gain/loss are calculated here

export function getInvestment(purchasePrice: number, qty: number) {
  // how much money i put in = buy price × quantity
  return purchasePrice * qty;
}

export function getCurrentValue(cmp: number | null, qty: number) {
  // value today = live price × qty
  // if cmp is missing we return null (table shows -)
  if (cmp == null || !Number.isFinite(cmp)) return null;
  return cmp * qty;
}

export function getProfitLoss(currentValue: number | null, investment: number) {
  // gain or loss = what its worth now minus what i paid
  if (currentValue == null) return null;
  return currentValue - investment;
}

export function getPortfolioWeight(stockInvestment: number, totalInvestment: number) {
  // how much % of whole portfolio is this one stock
  if (totalInvestment <= 0) return 0;
  return (stockInvestment / totalInvestment) * 100;
}
