import { create } from 'zustand';

export interface CurrebcyState {
  currency: number;
  currencyName: string;
  setCurrencyName: (name: string) => void;
  increase: (by: number) => void;
  decrease: (by: number) => void;
  reset: () => void;
}

export const useCurrencyStore = create<CurrebcyState>()((set) => ({
  currency: 0,
  currencyName: '',

  setCurrencyName: (name) => set({ currencyName: name }),

  increase: (by) => set((state) => ({ currency: state.currency + by })),
  decrease: (by) => set((state) => ({ currency: state.currency - by })),
  reset: () => set({ currency: 0 }),
}));
