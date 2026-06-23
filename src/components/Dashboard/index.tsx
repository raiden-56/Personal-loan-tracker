import { useEffect } from "react";
import { Box, Typography, Alert, Paper, Skeleton } from "@mui/material";
import Charts from "../Charts";
import { useLoanStore } from "../../store/useLoanStore";
import { useLoanMetrics } from "../../hooks/useLoanMetrics";
import { formatCurrency } from "../../constants";

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <Box sx={{ width: "100%", mt: 1 }}>
      <Box sx={{ height: 10, borderRadius: 5, bgcolor: "rgba(255,255,255,0.3)", overflow: "hidden" }}>
        <Box
          sx={{
            height: "100%",
            width: `${pct}%`,
            bgcolor: "#81c784",
            borderRadius: 5,
            transition: "width 0.5s ease",
          }}
        />
      </Box>
      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", mt: 0.5, display: "block" }}>
        {pct.toFixed(1)}% of loan paid off
      </Typography>
    </Box>
  );
}

export default function Dashboard() {
  const { loading, error, fetchData, loadSettings } = useLoanStore();
  const { kpis, summary, entries, settings } = useLoanMetrics();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        <Skeleton variant="text" width={180} height={36} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width={260} height={20} sx={{ mb: 4 }} />

        <Paper elevation={0} sx={{ p: 4, mb: 3, borderRadius: 3, border: "1px solid #e0e0e0" }}>
          <Skeleton variant="text" width={140} height={14} />
          <Skeleton variant="text" width={200} height={40} sx={{ mt: 0.5 }} />
          <Skeleton variant="rounded" width="100%" height={10} sx={{ mt: 2, borderRadius: 5 }} />
          <Box sx={{ display: "flex", gap: 4, mt: 3 }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i}>
                <Skeleton variant="text" width={70} height={12} />
                <Skeleton variant="text" width={100} height={24} sx={{ mt: 0.3 }} />
              </Box>
            ))}
          </Box>
        </Paper>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
          {[1, 2, 3, 4].map((i) => (
            <Paper key={i} elevation={0} sx={{ p: 2.5, borderRadius: 2, border: "1px solid #e0e0e0" }}>
              <Skeleton variant="text" width={90} height={12} />
              <Skeleton variant="text" width={120} height={28} sx={{ mt: 0.5 }} />
            </Paper>
          ))}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 3 }}>
          {[1, 2, 3, 4].map((i) => (
            <Paper key={i} elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid #e0e0e0" }}>
              <Skeleton variant="text" width={160} height={16} />
              <Skeleton variant="rounded" width="100%" height={200} sx={{ mt: 1 }} />
            </Paper>
          ))}
        </Box>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i}>
                <Skeleton variant="text" width={100} height={12} />
                <Skeleton variant="text" width={80} height={20} sx={{ mt: 0.3 }} />
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>
        Dashboard
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
        Track your home loan progress at a glance
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2, border: "1px solid", borderColor: "warning.light" }}>
          {error}
        </Alert>
      )}

      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #e0e0e0",
          background: "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
          color: "#fff",
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.8, letterSpacing: 1, textTransform: "uppercase", fontSize: "0.7rem" }}>
          Outstanding Balance
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 700, fontSize: "2.2rem", mt: 0.5 }}>
          {formatCurrency(kpis.outstandingBalance)}
        </Typography>
        <ProgressBar value={kpis.principalPaid} max={summary.originalLoanAmount} />
        <Box sx={{ display: "flex", gap: 4, mt: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.7, fontSize: "0.65rem" }}>
              Original Loan
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
              {formatCurrency(summary.originalLoanAmount)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.7, fontSize: "0.65rem" }}>
              Total Paid
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
              {formatCurrency(kpis.totalAmountPaid)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.7, fontSize: "0.65rem" }}>
              Interest Paid
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
              {formatCurrency(kpis.interestPaid)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.7, fontSize: "0.65rem" }}>
              Remaining
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
              {kpis.remainingTenureYears}Y {kpis.remainingTenureMonths}M
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Key Metrics */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
        {[
          { label: "Principal Paid", value: formatCurrency(kpis.principalPaid), color: "#2e7d32" },
          { label: "Interest Paid", value: formatCurrency(kpis.interestPaid), color: "#d32f2f" },
          { label: "Months Paid", value: `${settings.paidMonths} / ${settings.loanTenureYears * 12}`, color: "#1565c0" },
          { label: "Last Paid Month", value: kpis.lastPaidDate, color: "#1565c0" },
        ].map((item) => (
          <Paper key={item.label} elevation={0} sx={{ p: 2.5, borderRadius: 2, border: "1px solid #e0e0e0" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 0.5 }}>
              {item.label}
            </Typography>
            <Typography sx={{ fontWeight: 700, color: item.color, fontSize: "1.1rem", mt: 0.5 }}>
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Charts */}
      <Box sx={{ mb: 3 }}>
        <Charts entries={entries} principalPaid={kpis.principalPaid} outstandingBalance={kpis.outstandingBalance} />
      </Box>

      {/* Summary Details */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0", display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" }, gap: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.65rem", textTransform: "uppercase" }}>
            Total Extra Payments
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", mt: 0.3 }}>
            {formatCurrency(kpis.totalExtraPayments)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.65rem", textTransform: "uppercase" }}>
            Interest Saved
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", mt: 0.3, color: "#2e7d32" }}>
            {formatCurrency(kpis.interestSaved)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.65rem", textTransform: "uppercase" }}>
            Expected Closure
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", mt: 0.3 }}>
            {kpis.expectedClosureDate || "N/A"}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.65rem", textTransform: "uppercase" }}>
            Months Reduced
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", mt: 0.3, color: "#2e7d32" }}>
            {kpis.monthsReduced} months
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
