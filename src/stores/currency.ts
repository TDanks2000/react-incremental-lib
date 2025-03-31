import { create } from 'zustand';

export interface CurrencyState {
  currency: number;
  currencyName: string;
  maxValue?: number;
  minValue?: number;
  precision?: number;
  format?: (value: number) => string;
  setCurrencyName: (name: string) => void;
  setMaxValue: (max: number | undefined) => void;
  setMinValue: (min: number | undefined) => void;
  setPrecision: (precision: number) => void;
  setFormat: (formatter: ((value: number) => string) | undefined) => void;
  increase: (by: number) => void;
  decrease: (by: number) => void;
  reset: () => void;
  getValue: () => number;
  getFormatted: () => string;
}

export const useCurrencyStore = create<CurrencyState>()((set, get) => ({
  currency: 0,
  currencyName: '',
  maxValue: undefined,
  minValue: undefined,
  precision: 2,
  format: undefined,

  setCurrencyName: (name) => set({ currencyName: name }),
  setMaxValue: (max) => set({ maxValue: max }),
  setMinValue: (min) => set({ minValue: min }),
  setPrecision: (precision) => set({ precision: Math.max(0, Math.floor(precision)) }),
  setFormat: (formatter) => set({ format: formatter }),

  increase: (by) => set((state) => {
    const newValue = Number((state.currency + by).toFixed(state.precision));
    const cappedValue = state.maxValue !== undefined 
      ? Math.min(newValue, state.maxValue)
      : newValue;
    return { currency: cappedValue };
  }),

  decrease: (by) => set((state) => {
    const newValue = Number((state.currency - by).toFixed(state.precision));
    const cappedValue = state.minValue !== undefined
      ? Math.max(newValue, state.minValue)
      : newValue;
    return { currency: cappedValue };
  }),

  reset: () => set({ currency: 0 }),

  getValue: () => get().currency,

  getFormatted: () => {
    const state = get();
    if (state.format) {
      return state.format(state.currency);
    }
    return state.currency.toFixed(state.precision);
  }
}));
