export interface UseSaveGameProps<T> {
  data: T;
  onSave?: () => void;
  onDiscard?: () => void;
}

export interface UseLoadSaveGameProps<T> {
  onLoad?: (data: T) => void;
  onError?: (error: Error) => void;
}