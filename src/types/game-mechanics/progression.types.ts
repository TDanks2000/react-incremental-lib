export interface Achievement {
  id: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  condition: () => boolean;
  onUnlock?: () => void;
}

export interface UseAchievementProps {
  id: string;
  name: string;
  description: string;
  condition: () => boolean;
  onUnlock?: () => void;
}

export interface AchievementState {
  achievements: Achievement[];
  unlockedAchievements: string[];
}

export interface PrestigeState {
  prestigePoints: number;
  prestigeMultiplier: number;
  prestigeThreshold: number;
}

export interface PrestigeStore extends PrestigeState {
  addPrestigePoints: (amount: number) => void;
  setPrestigeMultiplier: (multiplier: number) => void;
  setPrestigeThreshold: (threshold: number) => void;
  reset: () => void;
}