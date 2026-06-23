import { Card, CardContent, Grid, Typography, Box } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentsIcon from "@mui/icons-material/Payments";
import SavingsIcon from "@mui/icons-material/Savings";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddCardIcon from "@mui/icons-material/AddCard";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import EventIcon from "@mui/icons-material/Event";
import SpeedIcon from "@mui/icons-material/Speed";
import { KPIData } from "../../types";
import { formatCurrency, COLORS } from "../../constants";

interface KPICardsProps {
  kpis: KPIData;
}

interface KPICardItem {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export default function KPICards({ kpis }: KPICardsProps) {
  const cards: KPICardItem[] = [
    {
      title: "Outstanding Balance",
      value: formatCurrency(kpis.outstandingBalance),
      icon: <AccountBalanceIcon fontSize="small" />,
      color: COLORS.warning,
    },
    {
      title: "Total Amount Paid",
      value: formatCurrency(kpis.totalAmountPaid),
      icon: <PaymentsIcon fontSize="small" />,
      color: COLORS.primary,
    },
    {
      title: "Principal Paid",
      value: formatCurrency(kpis.principalPaid),
      icon: <SavingsIcon fontSize="small" />,
      color: COLORS.success,
    },
    {
      title: "Interest Paid",
      value: formatCurrency(kpis.interestPaid),
      icon: <TrendingDownIcon fontSize="small" />,
      color: COLORS.error,
    },
    {
      title: "Remaining Tenure",
      value: `${kpis.remainingTenureYears}Y ${kpis.remainingTenureMonths}M`,
      icon: <CalendarMonthIcon fontSize="small" />,
      color: COLORS.info,
    },
    {
      title: "Total Extra Payments",
      value: formatCurrency(kpis.totalExtraPayments),
      icon: <AddCardIcon fontSize="small" />,
      color: COLORS.success,
    },
    {
      title: "Interest Saved",
      value: formatCurrency(kpis.interestSaved),
      icon: <MoneyOffIcon fontSize="small" />,
      color: COLORS.success,
    },
    {
      title: "Expected Closure",
      value: kpis.expectedClosureDate || "N/A",
      icon: <EventIcon fontSize="small" />,
      color: COLORS.primary,
    },
    {
      title: "Months Reduced",
      value: `${kpis.monthsReduced} months`,
      icon: <SpeedIcon fontSize="small" />,
      color: COLORS.success,
    },
    {
      title: "Last paid month",
      value: kpis.lastPaidDate,
      icon: <CalendarMonthIcon fontSize="small" />,
      color: COLORS.success,
    },
  ];

  return (
    <Grid container spacing={2.5}>
      {cards.map((card) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>
          <Card
            elevation={0}
            sx={{
              bgcolor: "#ffffff",
              border: "1px solid",
              borderColor: "grey.200",
              borderRadius: 3,
              height: "100%",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                borderColor: `${card.color}40`,
                boxShadow: `0 4px 20px ${card.color}12`,
                transform: "translateY(-1px)",
              },
            }}
          >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <Box
                  sx={{
                    bgcolor: `${card.color}12`,
                    borderRadius: 2,
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: card.color,
                    minWidth: 36,
                    minHeight: 36,
                  }}
                >
                  {card.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      letterSpacing: 0.3,
                      textTransform: "uppercase",
                      lineHeight: 1.2,
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: card.color,
                      fontSize: "1.25rem",
                      lineHeight: 1.4,
                      mt: 0.3,
                    }}
                  >
                    {card.value}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
