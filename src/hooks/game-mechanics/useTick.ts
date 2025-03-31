import { useEffect, useRef } from 'react';
import { UseTickProps } from '../../types/game-mechanics/timing.types';

type UseTickPropsWithEnabled = Omit<UseTickProps, 'onTick'> & {
  callback: () => void;
  enabled?: boolean;
}

export const useTick = ({
  interval,
  callback,
  enabled = true,
}: UseTickPropsWithEnabled) => {
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
