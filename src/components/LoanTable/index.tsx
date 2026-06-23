import { Box, Chip, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { LoanEntry } from "../../types";
import { formatCurrency } from "../../constants";
import { isMonthPaid } from "../../utils/dateUtils";

interface LoanTableProps {
  entries: LoanEntry[];
  loanStartDate: string;
}

const allColumns: GridColDef[] = [
  { field: "month", headerName: "Month", width: 70, type: "number" },
  { field: "date", headerName: "Date", width: 120 },
  {
    field: "openingBalance",
    headerName: "Opening",
    width: 130,
    type: "number",
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: "emi",
    headerName: "EMI",
    width: 110,
    type: "number",
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: "interest",
    headerName: "Interest",
    width: 110,
    type: "number",
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: "principal",
    headerName: "Principal",
    width: 110,
    type: "number",
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: "extraPayment",
    headerName: "Extra",
    width: 100,
    type: "number",
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: "totalPaid",
    headerName: "Total Paid",
    width: 120,
    type: "number",
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: "closingBalance",
    headerName: "Closing",
    width: 130,
    type: "number",
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: "paid",
    headerName: "Status",
    width: 100,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => (
      <Chip
        label={params.value ? "Paid" : "Pending"}
        color={params.value ? "success" : "default"}
        size="small"
        variant={params.value ? "filled" : "outlined"}
      />
    ),
  },
];

export default function LoanTable({ entries, loanStartDate }: LoanTableProps) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  const rows = entries.map((entry) => ({
    id: entry.month,
    ...entry,
    paid: isMonthPaid(loanStartDate, entry.month),
  }));

  const columns = isSm
    ? allColumns.filter((c) =>
        ["date", "emi", "interest", "principal", "closingBalance", "paid"].includes(c.field as string),
      )
    : isMd
      ? allColumns.filter((c) =>
          ["month", "date", "emi", "interest", "principal", "closingBalance", "paid"].includes(c.field as string),
        )
      : allColumns;

  return (
    <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Monthly Loan Schedule
        </Typography>
      </Box>
      <Box sx={{ height: 600, width: "100%", overflow: "auto" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: isSm ? 10 : 25 } },
          }}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            minWidth: isSm ? 600 : "auto",
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#f5f7fa",
              fontWeight: 600,
            },
            "& .MuiDataGrid-cell": {
              fontSize: 13,
            },
          }}
        />
      </Box>
    </Paper>
  );
}
