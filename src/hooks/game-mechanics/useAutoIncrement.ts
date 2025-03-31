import { useCallback, useEffect, useRef, useState } from 'react';
import { useCurrencyStore } from '../../stores';

interface UseAutoIncrementProps {
  interval: number;
  increaseBy: number;
  onPause?: () => void;
  onResume?: () => void;
  onAutoIncrement?: (amount: number) => void;
  options?: {
    startPaused?: boolean;
  };
}

/**
 * Hook to automatically increase currency by `increaseBy` every `interval` ms.
 *
 * @param {UseAutoIncrementProps} props
 * @param {number} props.interval - The interval in milliseconds.
 * @param {number} props.increaseBy - The amount to increase the currency by each interval.
 * @param {object} [props.options] - Additional configuration.
 * @param {boolean} [props.options.startPaused] - If true, starts in a paused state.
 * @param {Function} [props.onPause] - Called when the timer is paused.
 * @param {Function} [props.onResume] - Called when the timer is resumed.
 * @param {Function} [props.onAutoIncrement] - Called when the timer increments the currency.
 * @returns {{ pause: () => boolean, resume: () => void, isPaused: boolean }}
 *   An object with control methods and the paused state.
 */
export const useAutoIncrement = ({
  interval,
  increaseBy,
  onPause,
  onResume,
  onAutoIncrement,
  options,
}: UseAutoIncrementProps) => {
  const { increase } = useCurrencyStore();

  const timerIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(interval);
  const onResumeCalledRef = useRef<boolean>(false);

  const [isPaused, setIsPaused] = useState<boolean>(
    options?.startPaused ?? false,
  );

  const clearTimer = useCallback(() => {
    if (timerIdRef.current !== null) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerIdRef.current = window.setTimeout(() => {
      increase(increaseBy);
      remainingTimeRef.current = interval;
      startTimer();

      if (onAutoIncrement) {
        onAutoIncrement(increaseBy);
      }
    }, remainingTimeRef.current);
  }, [increase, increaseBy, interval]);

  const resume = useCallback(() => {
    if (!isPaused) return;

    setIsPaused(false);

    if (!onResumeCalledRef.current && onResume) {
      onResume();
      onResumeCalledRef.current = true;
    }

    startTimeRef.current = Date.now();
    timerIdRef.current = window.setTimeout(() => {
      increase(increaseBy);
      remainingTimeRef.current = interval;
      startTimer();
    }, remainingTimeRef.current);
  }, [isPaused, increase, increaseBy, interval, onResume, startTimer]);

  const pause = useCallback(() => {
    if (isPaused || timerIdRef.current === null) return false;

    clearTimer();
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(interval - elapsed, 0);
    setIsPaused(true);
    onResumeCalledRef.current = false;

    if (onPause) {
      onPause();
    }
    return true;
  }, [isPaused, interval, onPause, clearTimer]);

  useEffect(() => {
    if (!options?.startPaused) {
      startTimer();
    }
    return () => {
      clearTimer();
    };
  }, [options?.startPaused, startTimer, clearTimer]);

  return {
    pause,
    resume,
    isPaused,
  };
};
