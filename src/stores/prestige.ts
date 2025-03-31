import { create } from 'zustand';
import { useCurrencyStore } from '.';

interface PrestigeState {
  prestigePoints: number;
  prestigeMultiplier: number;
  prestigeThreshold: number;
  canPrestige: boolean;
  prestigeResetCallbacks: (() => void)[];
}

interface PrestigeStore extends PrestigeState {
  addPrestigePoints: (amount: number) => void;
  setPrestigeMultiplier: (multiplier: number) => void;
  setPrestigeThreshold: (threshold: number) => void;
  registerResetCallback: (callback: () => void) => void;
  prestige: () => void;
  reset: () => void;
}

export const usePrestigeStore = create<PrestigeStore>()((set, get) => ({
  prestigePoints: 0,
  prestigeMultiplier: 1,
  prestigeThreshold: 1000,
  canPrestige: false,
  prestigeResetCallbacks: [],

  addPrestigePoints: (amount) => set((state) => ({
    prestigePoints: state.prestigePoints + amount,
    prestigeMultiplier: state.prestigeMultiplier + amount * 0.1
  })),

  setPrestigeMultiplier: (multiplier) => set({ prestigeMultiplier: multiplier }),

  setPrestigeThreshold: (threshold) => set({ prestigeThreshold: threshold }),

  registerResetCallback: (callback) => set((state) => ({
    prestigeResetCallbacks: [...state.prestigeResetCallbacks, callback]
  })),

  prestige: () => {
    const state = get();
    const currency = useCurrencyStore.getState();

    if (currency.currency >= state.prestigeThreshold) {
      const prestigePointsGained = Math.floor(Math.sqrt(currency.currency / state.prestigeThreshold));
      state.addPrestigePoints(prestigePointsGained);
      state.prestigeResetCallbacks.forEach(callback => callback());
      currency.reset();
    }
  },

  reset: () => set({
    prestigePoints: 0,
    prestigeMultiplier: 1,
    prestigeThreshold: 1000,
    canPrestige: false,
    prestigeResetCallbacks: []
  })
}));