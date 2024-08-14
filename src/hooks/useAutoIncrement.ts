import { useCallback, useEffect, useRef } from 'react';
import useCurrencyStore from '../stores/currency';

interface useAutoIncrementProps {
  interval: number;
  increaseBy: number;
}

export const useAutoIncrement = ({
  interval,
  increaseBy,
}: {
  interval: number;
  increaseBy: number;
}) => {
  const { increase } = useCurrencyStore();

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const remainingTimeRef = useRef<number>(interval);
  const startTimeRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    intervalIdRef.current = setTimeout(() => {
      increase(increaseBy);
      remainingTimeRef.current = interval;
      start();
    }, remainingTimeRef.current);
    isPausedRef.current = false;
  }, [increase, increaseBy, interval]);

  const pause = useCallback(() => {
    if (!intervalIdRef.current) return false;

    if (!isPausedRef.current) {
      const elapsedTime = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(interval - elapsedTime, 0);
      isPausedRef.current = true;
      clearTimeout(intervalIdRef.current);
      intervalIdRef.current = null;
      return true;
    }

    start();
    return true;
  }, [interval]);

  useEffect(() => {
    start();

    return () => {
      if (intervalIdRef.current) clearTimeout(intervalIdRef.current);
    };
  }, [start]);

  return {
    interval: intervalIdRef.current,
    pause,
  };
};
