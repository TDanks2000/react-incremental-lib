import { useEffect, useRef } from 'react';

interface UseTickProps {
  interval: number;
  callback: () => void;
  enabled?: boolean;
}

export const useTick = ({
  interval,
  callback,
  enabled = true,
}: UseTickProps) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      callbackRef.current();
    };

    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval, enabled]);
};
