import { useCallback, useState } from 'react';

interface UseMultiplierProps {
  baseValue: number;
  initialMultiplier?: number;
}

export const useMultiplier = ({
  baseValue,
  initialMultiplier = 1,
}: UseMultiplierProps) => {
  const [multiplier, setMultiplier] = useState(initialMultiplier);

  const applyMultiplier = useCallback(() => {
    return baseValue * multiplier;
  }, [baseValue, multiplier]);

  const increaseMultiplier = useCallback((by: number) => {
    setMultiplier((prev) => prev + by);
  }, []);

  const resetMultiplier = useCallback(() => {
    setMultiplier(initialMultiplier);
  }, [initialMultiplier]);

  return { multiplier, applyMultiplier, increaseMultiplier, resetMultiplier };
};
