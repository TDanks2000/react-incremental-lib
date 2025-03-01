import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCooldownProps {
  duration: number;
  autoReset?: boolean;
}

export const useCooldown = ({
  duration,
  autoReset = true,
}: UseCooldownProps) => {
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startCooldown = useCallback(() => {
    if (isCoolingDown) return;

    setIsCoolingDown(true);
    setRemainingTime(duration);
    startTimeRef.current = Date.now();

    timeoutRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const timeLeft = Math.max(duration - elapsed, 0);
      setRemainingTime(timeLeft);

      if (timeLeft === 0) {
        clearInterval(timeoutRef.current!);
        setIsCoolingDown(false);
      }
    }, 100);
  }, [isCoolingDown, duration]);

  const resetCooldown = useCallback(() => {
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    setIsCoolingDown(false);
    setRemainingTime(0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, []);

  return { isCoolingDown, remainingTime, startCooldown, resetCooldown };
};
