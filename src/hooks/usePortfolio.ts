// usePortfolio.ts
// react hook - loads data from /api/portfolio and refreshes every 15 seconds
// used only in Dashboard (client component)

"use client";

import { useEffect, useState } from "react";
import type { PortfolioData } from "@/types/portfolio";

const REFRESH_EVERY_MS = 15000; // assignment asked for 15 sec refresh

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true; // so we dont set state after user left page
    let isFirstLoad = true;

    async function loadData(forceRefresh = false) {
      if (!isFirstLoad) setIsRefreshing(true); // show "updating" on 2nd call onwards
      setErrorMessage(null);

      try {
        const url = forceRefresh ? "/api/portfolio?refresh=true" : "/api/portfolio";
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);

        const data = (await response.json()) as PortfolioData;
        if (!isActive) return;

        setPortfolio(data);
        setLastUpdated(data.fetchedAt);
        isFirstLoad = false;
      } catch (error) {
        if (!isActive) return;
        setErrorMessage(
          error instanceof Error ? error.message : "Could not load portfolio"
        );
      } finally {
        if (isActive) {
          setLoading(false);
          setIsRefreshing(false);
        }
      }
    }

    loadData();
    const timer = setInterval(() => loadData(), REFRESH_EVERY_MS);

    return () => {
      isActive = false;
      clearInterval(timer);
    };
  }, []);

  // button "try again" - forces refresh=true
  function retryLoad() {
    setLoading(true);
    fetch("/api/portfolio?refresh=true")
      .then((response) => response.json())
      .then((data: PortfolioData) => {
        setPortfolio(data);
        setLastUpdated(data.fetchedAt);
        setErrorMessage(null);
      })
      .catch(() => setErrorMessage("Still not working. Please try again."))
      .finally(() => setLoading(false));
  }

  return {
    portfolio,
    loading,
    isRefreshing,
    errorMessage,
    lastUpdated,
    retryLoad,
  };
}
