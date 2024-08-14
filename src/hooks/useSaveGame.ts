import { useEffect } from 'react';

interface UseSaveGameProps<T> {
  data: T;
  onSave?: () => void;
  onDiscard?: () => void;
}

export const useSaveGame = <T>(props: UseSaveGameProps<T>) => {
  const localStorage = window.localStorage;
  const { data, onSave, onDiscard } = props;

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(data));
    if (onSave) onSave();

    return () => {
      if (onDiscard) onDiscard();
    };
  }, [data, onDiscard, onSave]);

  return {
    data,
  };
};
