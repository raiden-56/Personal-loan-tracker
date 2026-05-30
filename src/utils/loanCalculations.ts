import { LoanEntry, LoanSettings, KPIData, LoanSummary } from "../types";

export function calculateMonthlyInterestRate(annualRate: number): number {
  return annualRate / 12 / 100;
}

export function calculateOriginalTotalInterest(settings: LoanSettings): number {
  const monthlyRate = calculateMonthlyInterestRate(settings.interestRate);
  const totalMonths = settings.loanTenureYears * 12;
  const emi =
    (settings.loanAmount *
      monthlyRate *
      Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return emi * totalMonths - settings.loanAmount;
}

export function calculateOriginalEMI(settings: LoanSettings): number {
  const monthlyRate = calculateMonthlyInterestRate(settings.interestRate);
  const totalMonths = settings.loanTenureYears * 12;
  return (
    (settings.loanAmount *
      monthlyRate *
      Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
}

export function calculateRemainingTenure(
  outstandingBalance: number,
  emi: number,
  annualRate: number,
): number {
  if (outstandingBalance <= 0) return 0;
  const monthlyRate = calculateMonthlyInterestRate(annualRate);
  if (monthlyRate === 0) return Math.ceil(outstandingBalance / emi);

  const n =
    -Math.log(1 - (outstandingBalance * monthlyRate) / emi) /
    Math.log(1 + monthlyRate);
  return Math.ceil(isNaN(n) || !isFinite(n) ? 0 : n);
}

export function calculateInterestSaved(
  entries: LoanEntry[],
  settings: LoanSettings,
): number {
  const originalTotalInterest = calculateOriginalTotalInterest(settings);
  const interestPaidSoFar = entries.reduce((sum, e) => sum + e.interest, 0);

  const lastEntry = entries[entries.length - 1];
  if (!lastEntry) return 0;

  const outstandingBalance = lastEntry.closingBalance;
  const emi = calculateOriginalEMI(settings);
  const monthlyRate = calculateMonthlyInterestRate(settings.interestRate);

  // Calculate remaining interest without extra payments
  let remainingInterest = 0;
  let balance = outstandingBalance;
  while (balance > 0) {
    const monthInterest = balance * monthlyRate;
    remainingInterest += monthInterest;
    const principalPart = Math.min(emi - monthInterest, balance);
    balance -= principalPart;
    if (principalPart <= 0) break;
  }

  const projectedTotalInterest = interestPaidSoFar + remainingInterest;
  return Math.max(0, originalTotalInterest - projectedTotalInterest);
}

export function calculateKPIs(
  entries: LoanEntry[],
  settings: LoanSettings,
): KPIData {
  if (entries.length === 0) {
    return {
      outstandingBalance: settings.loanAmount,
      totalAmountPaid: 0,
      principalPaid: 0,
      interestPaid: 0,
      remainingTenureYears: settings.loanTenureYears,
      remainingTenureMonths: 0,
      totalExtraPayments: 0,
      interestSaved: 0,
      expectedClosureDate: "",
      monthsReduced: 0,
    };
  }

  // Only consider actually paid months
  const paidEntries = entries.slice(0, settings.paidMonths);
  const lastPaidEntry = paidEntries[paidEntries.length - 1];
  const outstandingBalance = lastPaidEntry.closingBalance;
  const totalAmountPaid = paidEntries.reduce((sum, e) => sum + e.totalPaid, 0);
  const principalPaid = paidEntries.reduce(
    (sum, e) => sum + e.principal + e.extraPayment,
    0,
  );
  const interestPaid = paidEntries.reduce((sum, e) => sum + e.interest, 0);
  const totalExtraPayments = paidEntries.reduce(
    (sum, e) => sum + e.extraPayment,
    0,
  );

  const emi = calculateOriginalEMI(settings);
  const remainingMonths = calculateRemainingTenure(
    outstandingBalance,
    emi,
    settings.interestRate,
  );
  const remainingTenureYears = Math.floor(remainingMonths / 12);
  const remainingTenureMonthsPart = remainingMonths % 12;

  const originalTotalMonths = settings.loanTenureYears * 12;
  const monthsElapsed = paidEntries.length;
  const originalRemainingMonths = originalTotalMonths - monthsElapsed;
  const monthsReduced = Math.max(0, originalRemainingMonths - remainingMonths);

  const interestSaved = calculateInterestSaved(paidEntries, settings);

  // Calculate expected closure date
  const now = new Date();
  const closureDate = new Date(
    now.getFullYear(),
    now.getMonth() + remainingMonths,
    1,
  );
  const expectedClosureDate = closureDate.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });

  return {
    outstandingBalance,
    totalAmountPaid,
    principalPaid,
    interestPaid,
    remainingTenureYears,
    remainingTenureMonths: remainingTenureMonthsPart,
    totalExtraPayments,
    interestSaved,
    expectedClosureDate,
    monthsReduced,
  };
}

export function calculateLoanSummary(
  entries: LoanEntry[],
  settings: LoanSettings,
): LoanSummary {
  const kpis = calculateKPIs(entries, settings);

  // Use loanStartDate from settings
  const [startYear, startMonth] = settings.loanStartDate
    ? settings.loanStartDate.split("-").map(Number)
    : [new Date().getFullYear(), new Date().getMonth() + 1];
  const originalClosureDate = new Date(
    startYear,
    startMonth - 1 + settings.loanTenureYears * 12,
    1,
  );

  return {
    originalLoanAmount: settings.loanAmount,
    outstandingBalance: kpis.outstandingBalance,
    totalAmountPaid: kpis.totalAmountPaid,
    principalPaid: kpis.principalPaid,
    interestPaid: kpis.interestPaid,
    totalExtraPayments: kpis.totalExtraPayments,
    interestSaved: kpis.interestSaved,
    originalClosureDate: originalClosureDate.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    }),
    revisedClosureDate: kpis.expectedClosureDate,
    monthsReduced: kpis.monthsReduced,
    remainingTenureMonths:
      kpis.remainingTenureYears * 12 + kpis.remainingTenureMonths,
  };
}
