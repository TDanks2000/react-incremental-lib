import { useEffect } from 'react';
import { useAchievementStore } from '../../stores';
import { useAchievement } from './useAchievement';

interface Achievement {
  name: string;
  condition: boolean;
  onUnlock?: () => void;
}

export const useAchievements = (achievementsList: Achievement[]) => {
  const { achievements, register } = useAchievementStore();

  useEffect(() => {
    // Ensure all achievements exist in the store without unlocking them
    achievementsList.forEach(({ name }) => {
      if (!(name in achievements)) {
        register(name); // Only registers, doesn't unlock
      }
    });
  }, [achievementsList, achievements, register]);

  // Use `useAchievement` for tracking achievement states properly
  achievementsList.forEach(({ name, condition, onUnlock }) => {
    useAchievement({ name, condition, onUnlock });
  });

  // Convert achievements object into an array
  const allAchievements = Object.entries(achievements).map(
    ([name, unlocked]) => ({
      name,
      unlocked,
    }),
  );

  // Get a specific achievement by name
  const getAchievement = (name: string) => ({
    name,
    unlocked: achievements[name] ?? false,
  });

  return { allAchievements, getAchievement };
};
