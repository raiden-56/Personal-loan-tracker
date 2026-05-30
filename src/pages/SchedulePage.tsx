import { useEffect } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import LoanTable from "../components/LoanTable";
import { useLoanStore } from "../store/useLoanStore";

export default function SchedulePage() {
  const { entries, loading, error, fetchData, loadSettings } = useLoanStore();

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
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Loan Schedule
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <LoanTable entries={entries} />
    </Box>
  );
}
