import { useEffect, useRef } from 'react';

interface UseGameLoopProps {
  fps: number;
  update: () => void;
  enabled?: boolean;
}

export const useGameLoop = ({
  fps,
  update,
  enabled = true,
}: UseGameLoopProps) => {
  const updateRef = useRef(update);

  useEffect(() => {
    updateRef.current = update;
  }, [update]);

  useEffect(() => {
    if (!enabled) return;

    const interval = 1000 / fps;
    const loop = () => {
      updateRef.current();
      setTimeout(loop, interval);
    };

    const loopId = setTimeout(loop, interval);
    return () => clearTimeout(loopId);
  }, [fps, enabled]);
};
