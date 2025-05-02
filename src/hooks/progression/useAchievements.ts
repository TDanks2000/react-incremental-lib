import { useEffect, useMemo } from 'react';
import { useAchievementStore } from '../../stores';
import { useAchievement } from './useAchievement';

export interface Achievement {
  name: string;
  condition: boolean;
  onUnlock?: () => void;
  category?: string;
  description?: string;
  icon?: string;
  hidden?: boolean;
  progress?: number; // Progress value between 0 and 1
  progressTarget?: number; // Target value for progress calculation
  progressCurrent?: number; // Current value for progress calculation
}

export interface UseAchievementsOptions {
  persistenceKey?: string;
  onAchievementUnlocked?: (achievementName: string) => void;
}

export interface UseAchievementsReturn {
  allAchievements: {
    name: string;
    unlocked: boolean;
    category: string;
    description: string;
    icon?: string;
    hidden: boolean;
    progress: number;
  }[];
  getAchievement: (name: string) => {
    name: string;
    unlocked: boolean;
    category: string;
    description: string;
    icon?: string;
    hidden: boolean;
    progress: number;
  };
  getAchievementsByCategory: (category: string) => {
    name: string;
    unlocked: boolean;
    category: string;
    description: string;
    icon?: string;
    hidden: boolean;
    progress: number;
  }[];
  categories: string[];
  completionPercentage: number;
}

export const useAchievements = (
  achievementsList: Achievement[],
  options?: UseAchievementsOptions,
): UseAchievementsReturn => {
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
    useAchievement({
      name,
      condition,
      onUnlock: () => {
        if (onUnlock) onUnlock();
        if (options?.onAchievementUnlocked) options.onAchievementUnlocked(name);
      },
    });
  });

  // Convert achievements object into an array with additional metadata
  const allAchievements = useMemo(() => {
    return Object.entries(achievements).map(([name, achievementData]) => {
      // Find the achievement definition to get metadata
      const definition = achievementsList.find((a) => a.name === name);

      // Calculate progress if progressCurrent and progressTarget are provided
      let progress = definition?.progress;
      if (
        definition?.progressCurrent !== undefined &&
        definition?.progressTarget !== undefined
      ) {
        progress = Math.min(
          1,
          Math.max(0, definition.progressCurrent / definition.progressTarget),
        );
      }

      return {
        name,
        unlocked: achievementData.unlocked,
        category: definition?.category || 'General',
        description: definition?.description || '',
        icon: definition?.icon,
        hidden: definition?.hidden || false,
        progress:
          progress || (achievementData.unlocked ? 1 : achievementData.progress),
      };
    });
  }, [achievements, achievementsList]);

  // Get a specific achievement by name with metadata
  const getAchievement = (name: string) => {
    const achievementData = achievements[name];
    const unlocked = achievementData?.unlocked ?? false;
    const definition = achievementsList.find((a) => a.name === name);

    // Calculate progress if progressCurrent and progressTarget are provided
    let progress = definition?.progress;
    if (
      definition?.progressCurrent !== undefined &&
      definition?.progressTarget !== undefined
    ) {
      progress = Math.min(
        1,
        Math.max(0, definition.progressCurrent / definition.progressTarget),
      );
    }

    return {
      name,
      unlocked,
      category: definition?.category || 'General',
      description: definition?.description || '',
      icon: definition?.icon,
      hidden: definition?.hidden || false,
      progress: progress || (unlocked ? 1 : achievementData?.progress || 0),
    };
  };

  // Get achievements by category
  const getAchievementsByCategory = (category: string) => {
    return allAchievements.filter(
      (achievement) => achievement.category === category,
    );
  };

  // Get all categories
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    allAchievements.forEach((achievement) => {
      if (achievement.category) {
        categorySet.add(achievement.category);
      }
    });
    return Array.from(categorySet);
  }, [allAchievements]);

  // Get completion percentage
  const completionPercentage = useMemo(() => {
    const total = allAchievements.length;
    if (total === 0) return 0;

    const unlocked = allAchievements.filter((a) => a.unlocked).length;
    return (unlocked / total) * 100;
  }, [allAchievements]);

  return {
    allAchievements,
    getAchievement,
    getAchievementsByCategory,
    categories,
    completionPercentage,
  };
};
