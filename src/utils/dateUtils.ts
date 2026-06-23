export function getMonthDueDate(
  loanStartDate: string,
  monthNumber: number,
): Date {
  const [year, month] = loanStartDate.split("-").map(Number);
  const totalMonths = month + monthNumber - 1;
  const dueYear = year + Math.floor((totalMonths - 1) / 12);
  const dueMonth = ((totalMonths - 1) % 12) + 1;
  return new Date(dueYear, dueMonth - 1, 5);
}

export function isMonthPaid(
  loanStartDate: string,
  monthNumber: number,
): boolean {
  const now = new Date();
  const dueDate = getMonthDueDate(loanStartDate, monthNumber);
  return now > dueDate;
}

export function calculatePaidMonths(loanStartDate: string): number {
  const now = new Date();
  const [startYear, startMonth] = loanStartDate.split("-").map(Number);

  const totalMonths =
    (now.getFullYear() - startYear) * 12 + (now.getMonth() + 1 - startMonth);

  if (totalMonths < 0) return 0;

  if (now.getDate() > 5) {
    return totalMonths + 1;
  }
  return totalMonths;
}
