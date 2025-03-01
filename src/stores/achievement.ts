import { create } from 'zustand';

export interface AchievementState {
  achievements: Record<string, boolean>;
  register: (name: string) => void; // Register an achievement without unlocking it
  unlock: (name: string) => void;
  isUnlocked: (name: string) => boolean;
  reset: () => void;
}

const STORAGE_KEY = 'achievements';

export const useAchievementStore = create<AchievementState>()((set, get) => {
  const loadAchievements = (): Record<string, boolean> => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  };

  return {
    achievements: loadAchievements(),

    register: (name) =>
      set((state) => {
        if (name in state.achievements) return state; // Already registered

        const updated = { ...state.achievements, [name]: false };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        return { achievements: updated };
      }),

    unlock: (name) =>
      set((state) => {
        if (state.achievements[name]) return state; // Already unlocked

        const updated = { ...state.achievements, [name]: true };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        return { achievements: updated };
      }),

    isUnlocked: (name) => !!get().achievements[name],

    reset: () => {
      localStorage.removeItem(STORAGE_KEY);
      set({ achievements: {} });
    },
  };
});
