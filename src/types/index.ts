export interface LoanEntry {
  month: number;
  date: string;
  openingBalance: number;
  emi: number;
  interest: number;
  principal: number;
  extraPayment: number;
  totalPaid: number;
  closingBalance: number;
}

export interface LoanSettings {
  loanAmount: number;
  interestRate: number;
  loanTenureYears: number;
  googleSheetUrl: string;
  loanStartDate: string;
  paidMonths: number;
}

export interface LoanSummary {
  originalLoanAmount: number;
  outstandingBalance: number;
  totalAmountPaid: number;
  principalPaid: number;
  interestPaid: number;
  totalExtraPayments: number;
  interestSaved: number;
  originalClosureDate: string;
  revisedClosureDate: string;
  monthsReduced: number;
  remainingTenureMonths: number;
}

export interface KPIData {
  outstandingBalance: number;
  totalAmountPaid: number;
  principalPaid: number;
  interestPaid: number;
  remainingTenureYears: number;
  remainingTenureMonths: number;
  totalExtraPayments: number;
  interestSaved: number;
  expectedClosureDate: string;
  monthsReduced: number;
  lastPaidDate: string;
}
