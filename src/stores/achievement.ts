import { create } from 'zustand';
import { createMiddleware, MiddlewareOptions } from './middleware';

export interface AchievementData {
  unlocked: boolean;
  progress: number;
  metadata?: Record<string, any>;
}

export interface AchievementState {
  achievements: Record<string, AchievementData>;
  register: (name: string, metadata?: Record<string, any>) => void; // Register an achievement without unlocking it
  updateProgress: (name: string, progress: number) => void; // Update progress for an achievement
  unlock: (name: string) => void;
  isUnlocked: (name: string) => boolean;
  getProgress: (name: string) => number;
  updateMetadata: (name: string, metadata: Record<string, any>) => void;
  reset: () => void;
}

const STORAGE_KEY = 'achievements';

export const createAchievementStore = (middlewareOptions?: {
  logger?: MiddlewareOptions;
  performance?: MiddlewareOptions;
}) => {
  const middleware = createMiddleware<AchievementState>(middlewareOptions);
  return create<AchievementState>()(
    middleware((set, get) => {
      const loadAchievements = (): Record<string, AchievementData> => {
        try {
          const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

          // Handle migration from old format (boolean values) to new format (objects)
          const migrated: Record<string, AchievementData> = {};

          Object.entries(data).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
              // Convert old format to new format
              migrated[key] = { unlocked: value, progress: value ? 1 : 0 };
            } else {
              // Already in new format
              migrated[key] = value as AchievementData;
            }
          });

          return migrated;
        } catch {
          return {};
        }
      };

      return {
        achievements: loadAchievements(),

        register: (name, metadata = {}) =>
          set((state) => {
            if (name in state.achievements) return state; // Already registered

            const updated = {
              ...state.achievements,
              [name]: { unlocked: false, progress: 0, metadata },
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

            return { achievements: updated };
          }),

        updateProgress: (name, progress) =>
          set((state) => {
            const normalizedProgress = Math.min(1, Math.max(0, progress));
            const achievement = state.achievements[name];

            // Don't update if progress is lower than current or achievement is already unlocked
            if (
              normalizedProgress <= achievement.progress ||
              achievement.unlocked
            ) {
              return state;
            }

            const updated = {
              ...state.achievements,
              [name]: {
                ...achievement,
                progress: normalizedProgress,
                // Auto-unlock if progress reaches 100%
                unlocked: normalizedProgress >= 1 ? true : achievement.unlocked,
              },
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return { achievements: updated };
          }),

        unlock: (name) =>
          set((state) => {
            if (!(name in state.achievements)) {
              // Register if not exists
              get().register(name);
              // Return current state after registration
              return { achievements: get().achievements };
            }

            if (state.achievements[name].unlocked) return state; // Already unlocked

            const updated = {
              ...state.achievements,
              [name]: {
                ...state.achievements[name],
                unlocked: true,
                progress: 1,
              },
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

            return { achievements: updated };
          }),

        isUnlocked: (name) => {
          const achievement = get().achievements[name];
          return achievement ? achievement.unlocked : false;
        },

        getProgress: (name) => {
          const achievement = get().achievements[name];
          return achievement ? achievement.progress : 0;
        },

        updateMetadata: (name, metadata) =>
          set((state) => {
            if (!(name in state.achievements)) {
              // Register if not exists
              get().register(name, metadata);
              // Return current state after registration
              return { achievements: get().achievements };
            }

            const updated = {
              ...state.achievements,
              [name]: {
                ...state.achievements[name],
                metadata: {
                  ...state.achievements[name].metadata,
                  ...metadata,
                },
              },
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return { achievements: updated };
          }),

        reset: () => {
          localStorage.removeItem(STORAGE_KEY);
          set({ achievements: {} });
        },
      };
    }),
  );
};

// Default store instance with no middleware for backward compatibility
export const useAchievementStore = createAchievementStore();
