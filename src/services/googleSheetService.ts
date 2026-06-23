import Papa from "papaparse";
import { LoanEntry } from "../types";

function extractSheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

function buildCsvUrl(sheetId: string): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
}

function parseNumber(value: string | undefined): number {
  if (!value) return 0;
  const cleaned = value.replace(/[₹,\s]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export interface SheetMetadata {
  loanAmount: number;
  interestRate: number;
  loanTenureYears: number;
  emi: number;
}

export interface SheetResult {
  entries: LoanEntry[];
  metadata: SheetMetadata;
}

function getMonthDate(loanStartDate: string, monthNumber: number): string {
  const [year, month] = loanStartDate.split("-").map(Number);
  const totalMonths = month + monthNumber - 1;
  const dueYear = year + Math.floor((totalMonths - 1) / 12);
  const dueMonth = ((totalMonths - 1) % 12) + 1;
  const date = new Date(dueYear, dueMonth - 1, 5);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function fetchSheetData(
  googleSheetUrl: string,
  loanStartDate: string,
): Promise<SheetResult> {
  const sheetId = extractSheetId(googleSheetUrl);
  if (!sheetId) {
    throw new Error("Invalid Google Sheet URL. Please check the URL format.");
  }

  const csvUrl = buildCsvUrl(sheetId);

  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error(
      "Failed to fetch data from Google Sheet. Make sure the sheet is published to the web.",
    );
  }

  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data as string[][];

          // Rows 0-3 contain metadata
          const metadata: SheetMetadata = {
            loanAmount: parseNumber(rows[0]?.[2]),
            interestRate: parseFloat(
              (rows[1]?.[2] || "0").replace("%", ""),
            ),
            loanTenureYears: parseNumber(rows[2]?.[2]),
            emi: parseNumber(rows[3]?.[2]),
          };

          // Data starts from row 5 (row 4 is the visual header row)
          const entries: LoanEntry[] = [];
          for (let i = 5; i < rows.length; i++) {
            const row = rows[i];
            const month = parseNumber(row[0]);
            if (month <= 0) continue;

            entries.push({
              month,
              date: getMonthDate(loanStartDate, month),
              openingBalance: parseNumber(row[1]),
              emi: metadata.emi,
              interest: parseNumber(row[2]),
              principal: parseNumber(row[3]),
              extraPayment: 0,
              totalPaid: metadata.emi,
              closingBalance: parseNumber(row[4]),
            });
          }

          resolve({ entries, metadata });
        } catch {
          reject(
            new Error(
              "Failed to parse sheet data. Please check the column format.",
            ),
          );
        }
      },
      error: (error: Error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    });
  });
}
