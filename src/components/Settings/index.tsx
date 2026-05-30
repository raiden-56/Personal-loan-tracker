import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Snackbar,
  Alert,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useLoanStore } from "../../store/useLoanStore";
import { LoanSettings } from "../../types";

export default function Settings() {
  const { settings, setSettings } = useLoanStore();
  const [form, setForm] = useState<LoanSettings>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = () => {
    setSettings(form);
    setSaved(true);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
          >
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Loan Details
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  label="Loan Amount"
                  type="number"
                  value={form.loanAmount}
                  onChange={(e) =>
                    setForm({ ...form, loanAmount: Number(e.target.value) })
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    },
                  }}
                  fullWidth
                />
                <TextField
                  label="Interest Rate"
                  type="number"
                  value={form.interestRate}
                  onChange={(e) =>
                    setForm({ ...form, interestRate: Number(e.target.value) })
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    },
                    htmlInput: { step: 0.01 },
                  }}
                  fullWidth
                />
                <TextField
                  label="Loan Tenure"
                  type="number"
                  value={form.loanTenureYears}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      loanTenureYears: Number(e.target.value),
                    })
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">Years</InputAdornment>
                      ),
                    },
                  }}
                  fullWidth
                />
                <TextField
                  label="Loan Start Date"
                  type="month"
                  value={form.loanStartDate}
                  onChange={(e) =>
                    setForm({ ...form, loanStartDate: e.target.value })
                  }
                  fullWidth
                  helperText="Month when you started paying the loan"
                />
                <TextField
                  label="Months Paid So Far"
                  type="number"
                  value={form.paidMonths}
                  onChange={(e) =>
                    setForm({ ...form, paidMonths: Number(e.target.value) })
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">Months</InputAdornment>
                      ),
                    },
                  }}
                  fullWidth
                  helperText="Number of EMIs actually paid till date"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
          >
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Google Sheet Integration
              </Typography>
              <TextField
                label="Google Sheet URL"
                placeholder="https://docs.google.com/spreadsheets/d/XXXXX"
                value={form.googleSheetUrl}
                onChange={(e) =>
                  setForm({ ...form, googleSheetUrl: e.target.value })
                }
                fullWidth
                helperText="Paste your published Google Sheet URL here. The sheet must be published to the web (File → Share → Publish to web → CSV)."
              />
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Expected columns in your Google Sheet:
                </Typography>
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    bgcolor: "#f5f7fa",
                    p: 1.5,
                    borderRadius: 1,
                  }}
                >
                  Month | Date | Opening Balance | EMI | Interest | Principal |
                  Extra Payment | Total Paid | Closing Balance
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ textTransform: "none", px: 4 }}
          >
            Save Settings
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSaved(false)}>
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
