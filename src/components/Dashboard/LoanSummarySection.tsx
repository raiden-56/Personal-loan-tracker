import { Paper, Typography, Grid, Box, Divider } from "@mui/material";
import { LoanSummary } from "../../types";
import { formatCurrency, COLORS } from "../../constants";

interface LoanSummarySectionProps {
  summary: LoanSummary;
}

interface SummaryItem {
  label: string;
  value: string;
  color?: string;
}

export default function LoanSummarySection({
  summary,
}: LoanSummarySectionProps) {
  const topRow: SummaryItem[] = [
    {
      label: "Original Loan Amount",
      value: formatCurrency(summary.originalLoanAmount),
      color: COLORS.primary,
    },
    {
      label: "Outstanding Balance",
      value: formatCurrency(summary.outstandingBalance),
      color: COLORS.warning,
    },
    {
      label: "Principal Paid",
      value: formatCurrency(summary.principalPaid),
      color: COLORS.success,
    },
    {
      label: "Interest Paid",
      value: formatCurrency(summary.interestPaid),
      color: COLORS.error,
    },
  ];

  const middleRow: SummaryItem[] = [
    {
      label: "Total Paid",
      value: formatCurrency(summary.totalAmountPaid),
      color: COLORS.primary,
    },
    {
      label: "Total Extra Payments",
      value: formatCurrency(summary.totalExtraPayments),
      color: COLORS.success,
    },
    {
      label: "Interest Saved",
      value: formatCurrency(summary.interestSaved),
      color: COLORS.success,
    },
    {
      label: "Months Reduced",
      value: `${summary.monthsReduced} months`,
      color: COLORS.success,
    },
  ];

  const bottomRow: SummaryItem[] = [
    { label: "Original Closure Date", value: summary.originalClosureDate },
    {
      label: "Revised Closure Date",
      value: summary.revisedClosureDate,
      color: COLORS.success,
    },
  ];

  const renderRow = (items: SummaryItem[]) => (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid size={{ xs: 6, sm: 3 }} key={item.label}>
          <Box sx={{ py: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: 0.3,
                textTransform: "uppercase",
              }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
                color: item.color || "text.primary",
                fontSize: "1.1rem",
                mt: 0.5,
              }}
            >
              {item.value}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3.5,
        border: "1px solid",
        borderColor: "grey.200",
        borderRadius: 3,
        bgcolor: "#ffffff",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          mb: 2.5,
          fontSize: "1rem",
          color: "text.primary",
        }}
      >
        Loan Summary
      </Typography>

      {renderRow(topRow)}
      <Divider sx={{ my: 2, borderColor: "grey.100" }} />
      {renderRow(middleRow)}
      <Divider sx={{ my: 2, borderColor: "grey.100" }} />
      {renderRow(bottomRow)}
    </Paper>
  );
}
