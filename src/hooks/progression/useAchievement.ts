import { useEffect } from 'react';
import { useAchievementStore } from '../../stores';

interface UseAchievementProps {
  name: string;
  condition: boolean;
  onUnlock?: () => void;
}

export const useAchievement = ({
  name,
  condition,
  onUnlock,
}: UseAchievementProps) => {
  const { isUnlocked, unlock } = useAchievementStore();

  useEffect(() => {
    if (!isUnlocked(name) && condition) {
      unlock(name);
      if (onUnlock) onUnlock();
    }
  }, [condition, isUnlocked, unlock, name, onUnlock]);

  return { unlocked: isUnlocked(name) };
};
