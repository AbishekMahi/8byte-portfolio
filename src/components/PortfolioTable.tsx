// PortfolioTable.tsx
// big table with all columns from assignment
// uses tanstack table - just helps render rows, data already calculated on server

"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { PortfolioRow } from "@/types/portfolio";
import {
  formatPercent,
  formatQuantity,
  formatRupee,
  getGainLossColor,
} from "@/utils/formatters";

const column = createColumnHelper<PortfolioRow>();

export function PortfolioTable({ rows, title }: { rows: PortfolioRow[]; title?: string }) {
  const columns = [
    column.accessor("particulars", { header: "Stock" }),
    column.accessor("purchasePrice", {
      header: "Buy price",
      cell: (info) => formatRupee(info.getValue()),
    }),
    column.accessor("qty", {
      header: "Qty",
      cell: (info) => formatQuantity(info.getValue()),
    }),
    column.accessor("investment", {
      header: "Invested",
      cell: (info) => formatRupee(info.getValue()),
    }),
    column.accessor("portfolioPct", {
      header: "Weight",
      cell: (info) => formatPercent(info.getValue()),
    }),
    column.accessor("exchangeCode", { header: "Symbol" }),
    // CMP = current market price (live) - see FINANCE_TERMS.md
    column.accessor("cmp", { header: "CMP (live price)", cell: (info) => formatRupee(info.getValue()) }),
    column.accessor("presentValue", {
      header: "Value now",
      cell: (info) => formatRupee(info.getValue()),
    }),
    column.accessor("gainLoss", {
      header: "Gain / Loss",
      cell: (info) => {
        const value = info.getValue();
        return <span className={getGainLossColor(value)}>{formatRupee(value)}</span>;
      },
    }),
    column.accessor("peRatio", {
      header: "P/E ratio",
      cell: (info) => (info.getValue() == null ? "-" : String(info.getValue())),
    }),
    column.accessor("latestEarnings", {
      header: "Earnings (Rs.)",
      cell: (info) => (info.getValue() == null ? "-" : String(info.getValue())),
    }),
  ];

  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {title && (
        <div className="border-b bg-slate-50 px-3 py-2 text-sm font-medium">{title}</div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-800 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="whitespace-nowrap px-3 py-2 font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`border-t border-slate-100 transition-colors hover:bg-slate-100 ${
                  index % 2 === 1 ? "bg-slate-50" : "bg-white"
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="whitespace-nowrap px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
