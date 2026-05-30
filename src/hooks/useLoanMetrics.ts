import { useMemo } from "react";
import { useLoanStore } from "../store/useLoanStore";
import { calculateKPIs, calculateLoanSummary } from "../utils/loanCalculations";

export function useLoanMetrics() {
  const entries = useLoanStore((state) => state.entries);
  const settings = useLoanStore((state) => state.settings);

  const kpis = useMemo(
    () => calculateKPIs(entries, settings),
    [entries, settings],
  );
  const summary = useMemo(
    () => calculateLoanSummary(entries, settings),
    [entries, settings],
  );

  return { kpis, summary, entries, settings };
}
