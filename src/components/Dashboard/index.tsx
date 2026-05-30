import { useEffect } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import KPICards from "../KPICards";
import Charts from "../Charts";
import LoanSummarySection from "./LoanSummarySection";
import { useLoanStore } from "../../store/useLoanStore";
import { useLoanMetrics } from "../../hooks/useLoanMetrics";

export default function Dashboard() {
  const { loading, error, fetchData, loadSettings } = useLoanStore();
  const { kpis, summary, entries } = useLoanMetrics();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          mb: 1,
          color: "text.primary",
          letterSpacing: -0.5,
        }}
      >
        Dashboard
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
        Track your home loan progress at a glance
      </Typography>

      {error && (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "warning.light",
          }}
        >
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <KPICards kpis={kpis} />
        <LoanSummarySection summary={summary} />
        <Charts
          entries={entries}
          principalPaid={kpis.principalPaid}
          outstandingBalance={kpis.outstandingBalance}
        />
      </Box>
    </Box>
  );
}
