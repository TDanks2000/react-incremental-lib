import { useEffect, useMemo } from 'react';
import { useAchievementStore } from '../../stores';

export interface UseAchievementProps {
  name: string;
  condition: boolean;
  onUnlock?: () => void;
  progress?: number; // Direct progress value between 0-1
  progressCurrent?: number; // Current progress value for calculation
  progressTarget?: number; // Target value for progress calculation
  category?: string;
  description?: string;
  icon?: string;
  hidden?: boolean;
}

export const useAchievement = ({
  name,
  condition,
  onUnlock,
  progress,
  progressCurrent,
  progressTarget,
  category = 'General',
  description = '',
  icon,
  hidden = false,
}: UseAchievementProps) => {
  const { isUnlocked, unlock } = useAchievementStore();

  // Calculate progress if progressCurrent and progressTarget are provided
  const calculatedProgress = useMemo(() => {
    if (progress !== undefined) return progress;
    if (progressCurrent !== undefined && progressTarget !== undefined) {
      return Math.min(1, Math.max(0, progressCurrent / progressTarget));
    }
    return isUnlocked(name) ? 1 : 0;
  }, [progress, progressCurrent, progressTarget, isUnlocked, name]);

  useEffect(() => {
    if (!isUnlocked(name) && condition) {
      unlock(name);
      if (onUnlock) onUnlock();
    }
  }, [condition, isUnlocked, unlock, name, onUnlock]);

  return {
    unlocked: isUnlocked(name),
    progress: calculatedProgress,
    category,
    description,
    icon,
    hidden,
  };
};
