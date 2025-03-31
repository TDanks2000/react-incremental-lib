import { useEffect } from 'react';
import { UseSaveGameProps } from '../../types/game-mechanics/save.types';

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
