import { Box, Paper, Typography, Grid } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { LoanEntry } from "../../types";
import { COLORS, formatCurrency } from "../../constants";

interface ChartsProps {
  entries: LoanEntry[];
  principalPaid: number;
  outstandingBalance: number;
}

export default function Charts({
  entries,
  principalPaid,
  outstandingBalance,
}: ChartsProps) {
  if (entries.length === 0) return null;

  const balanceData = entries.map((e) => ({
    month: `M${e.month}`,
    balance: e.closingBalance,
  }));

  const principalVsInterest = entries.map((e) => ({
    month: `M${e.month}`,
    principal: e.principal + e.extraPayment,
    interest: e.interest,
  }));

  const totalPaid = principalPaid;
  const remaining = outstandingBalance;
  const progressData = [
    { name: "Paid", value: totalPaid },
    { name: "Remaining", value: remaining },
  ];
  const progressColors = [COLORS.success, COLORS.warning];

  const cumulativeInterestSaved = entries.reduce<
    { month: string; saved: number }[]
  >((acc, e, i) => {
    const prevSaved = i > 0 ? acc[i - 1].saved : 0;
    return [
      ...acc,
      { month: `M${e.month}`, saved: prevSaved + e.extraPayment * 0.3 },
    ];
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTooltipValue = (value: any) => formatCurrency(Number(value));

  return (
    <Grid container spacing={3}>
      {/* Outstanding Balance Trend */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          elevation={0}
          sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Outstanding Balance Trend
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={balanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis
                fontSize={11}
                tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
              />
              <Tooltip formatter={formatTooltipValue} />
              <Line
                type="monotone"
                dataKey="balance"
                stroke={COLORS.warning}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Principal vs Interest */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          elevation={0}
          sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Principal vs Interest
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={principalVsInterest}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis
                fontSize={11}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip formatter={formatTooltipValue} />
              <Legend />
              <Bar
                dataKey="principal"
                stackId="a"
                fill={COLORS.success}
                name="Principal"
              />
              <Bar
                dataKey="interest"
                stackId="a"
                fill={COLORS.error}
                name="Interest"
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Loan Progress */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          elevation={0}
          sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Loan Progress
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={progressData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(1)}%`
                }
              >
                {progressData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={progressColors[index]} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltipValue} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Interest Savings Trend */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          elevation={0}
          sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Cumulative Interest Savings Trend
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={cumulativeInterestSaved}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis
                fontSize={11}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip formatter={formatTooltipValue} />
              <Line
                type="monotone"
                dataKey="saved"
                stroke={COLORS.success}
                strokeWidth={2}
                dot={false}
                name="Interest Saved"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Loan Summary Box */}
      <Grid size={{ xs: 12 }}>
        <Paper
          elevation={0}
          sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Payment Breakdown Over Time
          </Typography>
          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Months Paid
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {entries.length}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Avg Monthly Payment
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formatCurrency(
                  entries.reduce((s, e) => s + e.totalPaid, 0) / entries.length,
                )}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Max Extra Payment
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formatCurrency(
                  Math.max(...entries.map((e) => e.extraPayment)),
                )}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
