import { LoanSettings } from "../types";

export const DEFAULT_SETTINGS: LoanSettings = {
  loanAmount: 1327000,
  interestRate: 7.65,
  loanTenureYears: 12,
  googleSheetUrl: "",
  loanStartDate: "2025-05",
  paidMonths: 12,
};

export const STORAGE_KEYS = {
  SETTINGS: "loan-tracker-settings",
} as const;

export const COLORS = {
  primary: "#1565c0",
  info: "#0288d1",
  success: "#2e7d32",
  warning: "#ed6c02",
  error: "#d32f2f",
  loan: "#1565c0",
  savings: "#2e7d32",
  remaining: "#ed6c02",
  interest: "#d32f2f",
} as const;

export const CURRENCY_FORMAT = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatCurrency = (value: number): string => {
  return CURRENCY_FORMAT.format(value);
};
