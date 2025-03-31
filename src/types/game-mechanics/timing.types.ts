export interface UseGameLoopProps {
  fps?: number;
  onTick?: (deltaTime: number) => void;
  onStart?: () => void;
  onStop?: () => void;
}

export interface UseTickProps {
  interval: number;
  onTick: () => void;
  startImmediately?: boolean;
}

export interface UseCooldownProps {
  duration: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export interface UseIdleProgressProps {
  onProgress: (progress: number) => void;
  interval?: number;
}

export interface OfflineProgressState {
  lastOnlineTime: number;
  offlineMultiplier: number;
}

export interface OfflineProgressStore extends OfflineProgressState {
  setLastOnlineTime: (time: number) => void;
  setOfflineMultiplier: (multiplier: number) => void;
}

export interface UseSaveGameProps<T> {
  key: string;
  initialState: T;
  version?: number;
  onLoad?: (state: T) => void;
  onSave?: (state: T) => void;
  autoSaveInterval?: number;
}