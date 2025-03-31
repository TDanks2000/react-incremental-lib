import { useEffect, useRef } from 'react';
import { create } from 'zustand';

interface OfflineProgressState {
  lastOnlineTime: number;
  maxOfflineTime: number;
  offlineMultiplier: number;
  offlineCallbacks: ((elapsedTime: number) => void)[];
}

interface OfflineProgressStore extends OfflineProgressState {
  setLastOnlineTime: (time: number) => void;
  setMaxOfflineTime: (time: number) => void;
  setOfflineMultiplier: (multiplier: number) => void;
  registerOfflineCallback: (callback: (elapsedTime: number) => void) => void;
  calculateOfflineProgress: () => void;
}

const useOfflineProgressStore = create<OfflineProgressStore>()((set, get) => ({
  lastOnlineTime: Date.now(),
  maxOfflineTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  offlineMultiplier: 0.5, // 50% efficiency when offline
  offlineCallbacks: [],

  setLastOnlineTime: (time) => set({ lastOnlineTime: time }),
  setMaxOfflineTime: (time) => set({ maxOfflineTime: time }),
  setOfflineMultiplier: (multiplier) => set({ offlineMultiplier: multiplier }),

  registerOfflineCallback: (callback) => set((state) => ({
    offlineCallbacks: [...state.offlineCallbacks, callback]
  })),

  calculateOfflineProgress: () => {
    const state = get();
    const currentTime = Date.now();
    const elapsedTime = currentTime - state.lastOnlineTime;
    const cappedElapsedTime = Math.min(elapsedTime, state.maxOfflineTime);
    const adjustedTime = cappedElapsedTime * state.offlineMultiplier;

    state.offlineCallbacks.forEach(callback => callback(adjustedTime));
    state.setLastOnlineTime(currentTime);
  }
}));

export const useOfflineProgress = () => {
  const store = useOfflineProgressStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      store.calculateOfflineProgress();
      initialized.current = true;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        store.setLastOnlineTime(Date.now());
      } else {
        store.calculateOfflineProgress();
      }
    };

    const handleBeforeUnload = () => {
      store.setLastOnlineTime(Date.now());
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return {
    maxOfflineTime: store.maxOfflineTime,
    offlineMultiplier: store.offlineMultiplier,
    setMaxOfflineTime: store.setMaxOfflineTime,
    setOfflineMultiplier: store.setOfflineMultiplier,
    registerOfflineCallback: store.registerOfflineCallback
  };
};