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

export async function fetchSheetData(
  googleSheetUrl: string,
): Promise<LoanEntry[]> {
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
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const entries: LoanEntry[] = (
            results.data as Record<string, string>[]
          ).map((row) => {
            const keys = Object.keys(row);
            return {
              month: parseNumber(row[keys[0]]),
              date: row[keys[1]] || "",
              openingBalance: parseNumber(row[keys[2]]),
              emi: parseNumber(row[keys[3]]),
              interest: parseNumber(row[keys[4]]),
              principal: parseNumber(row[keys[5]]),
              extraPayment: parseNumber(row[keys[6]]),
              totalPaid: parseNumber(row[keys[7]]),
              closingBalance: parseNumber(row[keys[8]]),
            };
          });
          resolve(entries.filter((e) => e.month > 0));
        } catch (error) {
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
