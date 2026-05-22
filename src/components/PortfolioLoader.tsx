// shown while first API call is loading (yahoo fetch on server)

export function PortfolioLoader() {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center px-6"
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute h-16 w-16 animate-ping rounded-full bg-blue-400/30" />
        <span className="relative h-12 w-12 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600" />
      </div>

      <h2 className="mt-8 text-xl font-semibold text-slate-800">Building dashboard</h2>
      <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-slate-500">
        Loading holdings and fetching live market prices... Please wait a moment.
      </p>

      <div className="mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-200">
        <div className="h-full w-2/5 animate-pulse rounded-full bg-blue-600" />
      </div>

      <p className="mt-4 text-xs text-slate-400">26 stocks · Yahoo Finance</p>
    </div>
  );
}
