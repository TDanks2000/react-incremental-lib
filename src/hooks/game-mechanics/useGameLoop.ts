import { useEffect, useRef } from 'react';

interface UseGameLoopProps {
  fps: number;
  update: (deltaTime: number) => void;
  enabled?: boolean;
  catchUp?: boolean;
}

export const useGameLoop = ({
  fps,
  update,
  enabled = true,
  catchUp = true,
}: UseGameLoopProps) => {
  const updateRef = useRef(update);
  const lastTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);

  useEffect(() => {
    updateRef.current = update;
  }, [update]);

  useEffect(() => {
    if (!enabled) return;

    const frameInterval = 1000 / fps;
    let rafId: number;

    const gameLoop = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (catchUp) {
        accumulatorRef.current += deltaTime;

        while (accumulatorRef.current >= frameInterval) {
          updateRef.current(frameInterval);
          accumulatorRef.current -= frameInterval;
        }
      } else {
        updateRef.current(deltaTime);
      }

      rafId = requestAnimationFrame(gameLoop);
    };

    rafId = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(rafId);
      lastTimeRef.current = 0;
      accumulatorRef.current = 0;
    };
  }, [fps, enabled, catchUp]);
};
