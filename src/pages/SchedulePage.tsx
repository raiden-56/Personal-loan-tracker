import { useEffect } from "react";
import { Box, Typography, Alert, Paper, Skeleton } from "@mui/material";
import LoanTable from "../components/LoanTable";
import { useLoanStore } from "../store/useLoanStore";

export default function SchedulePage() {
  const { entries, settings, loading, error, fetchData, loadSettings } =
    useLoanStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={36} sx={{ mb: 3 }} />
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid #e0e0e0" }}>
          <Skeleton variant="text" width={180} height={24} sx={{ mb: 2 }} />
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} variant="rounded" width="100%" height={36} sx={{ mb: 1, borderRadius: 1 }} />
          ))}
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Loan Schedule
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <LoanTable entries={entries} loanStartDate={settings.loanStartDate} />
    </Box>
  );
}
