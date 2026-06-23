import { create } from "zustand";
import { LoanEntry, LoanSettings } from "../types";
import { DEFAULT_SETTINGS, STORAGE_KEYS } from "../constants";
import { fetchSheetData } from "../services/googleSheetService";
import { calculatePaidMonths } from "../utils/dateUtils";

interface LoanStore {
  entries: LoanEntry[];
  settings: LoanSettings;
  loading: boolean;
  error: string | null;
  setSettings: (settings: LoanSettings) => void;
  fetchData: () => Promise<void>;
  loadSettings: () => void;
}

export const useLoanStore = create<LoanStore>((set, get) => ({
  entries: [],
  settings: DEFAULT_SETTINGS,
  loading: false,
  error: null,

  setSettings: (settings: LoanSettings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    set({ settings });
  },

  loadSettings: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored) as LoanSettings;
        set({ settings: { ...DEFAULT_SETTINGS, ...parsed } });
      }
    } catch {
      console.warn("Failed to load settings from localStorage");
    }
  },

  fetchData: async () => {
    const { settings } = get();

    set({ loading: true, error: null });
    try {
      const { entries, metadata } = await fetchSheetData(
        settings.googleSheetUrl,
        settings.loanStartDate,
      );

      const paidMonths = calculatePaidMonths(settings.loanStartDate);

      const updatedSettings: LoanSettings = {
        ...settings,
        loanAmount: metadata.loanAmount || settings.loanAmount,
        interestRate: metadata.interestRate || settings.interestRate,
        loanTenureYears: metadata.loanTenureYears || settings.loanTenureYears,
        paidMonths,
      };

      set({ entries, settings: updatedSettings, loading: false });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch data from Google Sheet";
      set({
        error: message,
        loading: false,
        entries: [],
      });
    }
  },
}));
