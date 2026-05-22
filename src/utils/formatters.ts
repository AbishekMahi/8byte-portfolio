// formatters.ts
// turns numbers into nice ₹ strings for the UI
// also green/red color for profit vs loss

const rupeeFormat = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export function formatRupee(amount?: number | null) {
  if (amount == null || Number.isNaN(amount)) return "-";
  return rupeeFormat.format(amount);
}

export function formatQuantity(qty?: number | null) {
  if (qty == null) return "-";
  return qty.toLocaleString("en-IN");
}

export function formatPercent(value?: number | null) {
  if (value == null || Number.isNaN(value)) return "-";
  return `${value.toFixed(2)}%`;
}

export function getGainLossColor(amount?: number | null) {
  // green if positive or zero, red if loss, grey if unknown
  if (amount == null) return "text-slate-500";
  return amount >= 0 ? "text-emerald-600" : "text-red-600";
}
