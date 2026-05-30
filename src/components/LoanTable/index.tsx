import { Box, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { LoanEntry } from "../../types";
import { formatCurrency } from "../../constants";

interface LoanTableProps {
  entries: LoanEntry[];
}

const columns: GridColDef[] = [
  { field: "month", headerName: "Month", width: 80, type: "number" },
  { field: "date", headerName: "Date", width: 120 },
  {
    field: "openingBalance",
    headerName: "Opening Balance",
    width: 150,
    type: "number",
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: "emi",
    headerName: "EMI",
    width: 120,
    type: "number",
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: "interest",
    headerName: "Interest",
    width: 120,
    type: "number",
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: "principal",
    headerName: "Principal",
    width: 120,
    type: "number",
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: "extraPayment",
    headerName: "Extra Payment",
    width: 140,
    type: "number",
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: "totalPaid",
    headerName: "Total Paid",
    width: 130,
    type: "number",
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: "closingBalance",
    headerName: "Closing Balance",
    width: 150,
    type: "number",
    valueFormatter: (value: number) => formatCurrency(value),
  },
];

export default function LoanTable({ entries }: LoanTableProps) {
  const rows = entries.map((entry) => ({
    id: entry.month,
    ...entry,
  }));

  return (
    <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Monthly Loan Schedule
        </Typography>
      </Box>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          disableRowSelectionOnClick
          sx={{
            border: "none",
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
