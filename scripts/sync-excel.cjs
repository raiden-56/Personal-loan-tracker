const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const excelPath = path.join(__dirname, "src/assets/excel.xls");
const outputPath = path.join(__dirname, "src/data/loanData.json");

const wb = XLSX.readFile(excelPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

const emi = data[5][2];
const rows = data
  .slice(10)
  .filter((r) => r.length >= 4 && typeof r[0] === "number" && r[1] > 1);

const entries = rows.map((r) => ({
  month: r[0],
  date: r[6] || "",
  openingBalance: Math.round(r[1] * 100) / 100,
  emi: Math.round(emi * 100) / 100,
  interest: Math.round(r[2] * 100) / 100,
  principal: Math.round(r[3] * 100) / 100,
  extraPayment: 0,
  totalPaid: Math.round(emi * 100) / 100,
  closingBalance: Math.round(r[4] * 100) / 100,
}));

fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
console.log(
  `✓ Synced ${entries.length} entries from Excel (EMI: ₹${Math.round(emi * 100) / 100})`,
);
