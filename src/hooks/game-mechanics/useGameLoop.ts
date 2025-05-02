import { useCallback, useEffect, useRef, useState } from 'react';

interface GameLoopOptions {
  tickRate?: number; // Milliseconds between ticks (default: 1000)
  startPaused?: boolean; // Whether to start in paused state (default: false)
  maxTickTime?: number; // Maximum time a tick can take before throttling (default: 16)
  catchupThreshold?: number; // Maximum number of ticks to process when catching up (default: 10)
  onTick?: (delta: number) => void; // Callback function executed on each tick
  debugMode?: boolean; // Enable performance logging (default: false)
}

interface GameLoopReturn {
  tick: number; // Current tick count
  deltaTime: number; // Time since last tick in milliseconds
  isPaused: boolean; // Current pause state
  fps: number; // Current frames per second
  togglePause: () => void; // Toggle pause state
  pause: () => void; // Pause the game loop
  resume: () => void; // Resume the game loop
  resetTick: () => void; // Reset tick counter to zero
}

export function useGameLoop(options?: GameLoopOptions): GameLoopReturn {
  // Destructure options with defaults:
  const {
    tickRate = 1000,
    startPaused = false,
    maxTickTime = 16,
    catchupThreshold = 10,
    onTick,
    debugMode = false,
  } = options || {};

  // Public states:
  const [tick, setTick] = useState<number>(0);
  const [deltaTime, setDeltaTime] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(startPaused);
  const [fps, setFps] = useState<number>(0);

  // Internal refs for persistent values across renders:
  const lastTickTimeRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const animationFrameIdRef = useRef<number>(0);

  // Main game loop function:
  const loop = useCallback(
    (currentTime: number) => {
      // Calculate FPS based on frame-to-frame timing
      if (lastFrameTimeRef.current !== null) {
        const frameDelta = currentTime - lastFrameTimeRef.current;
        const currentFps = 1000 / frameDelta;
        setFps(currentFps);
      }
      lastFrameTimeRef.current = currentTime;

      // If the game is paused, simply request the next frame and exit:
      if (isPaused) {
        animationFrameIdRef.current = requestAnimationFrame(loop);
        return;
      }

      // Establish last tick time if this is the first frame:
      if (lastTickTimeRef.current === null) {
        lastTickTimeRef.current = currentTime;
      }

      // Calculate elapsed time since the last tick:
      let delta = currentTime - lastTickTimeRef.current;

      // Process ticks if enough time has passed
      if (delta >= tickRate) {
        // Calculate how many ticks should be processed based on the elapsed time
        // but limit to the catchup threshold to avoid spiral of death.
        const ticksToProcess = Math.min(
          Math.floor(delta / tickRate),
          catchupThreshold,
        );

        for (let i = 0; i < ticksToProcess; i++) {
          // Calculate tick delta with throttling (do not exceed maxTickTime)
          const tickDelta = Math.min(tickRate, maxTickTime);
          // If provided, invoke the callback with the adjusted delta time
          if (onTick) {
            onTick(tickDelta);
          }
          // Update public deltaTime state (this will be the tick duration for the last tick processed)
          setDeltaTime(tickDelta);
          // Increment the tick counter
          setTick((prev) => prev + 1);

          if (debugMode) {
            console.log(
              `[GameLoop Debug] Tick ${tick + i + 1} processed with delta: ${tickDelta}ms`,
            );
          }
        }
        // Update lastTickTime to reflect the ticks processed.
        // This approach preserves "excess" time if not a multiple of tickRate.
        lastTickTimeRef.current =
          lastTickTimeRef.current + ticksToProcess * tickRate;
      }

      // Request the next frame:
      animationFrameIdRef.current = requestAnimationFrame(loop);
    },
    [
      catchupThreshold,
      isPaused,
      maxTickTime,
      onTick,
      tickRate,
      debugMode,
      tick,
    ],
  );

  // Start and manage the animation loop:
  useEffect(() => {
    // Initiate frame timing references
    lastFrameTimeRef.current = performance.now();
    // Start the loop
    animationFrameIdRef.current = requestAnimationFrame(loop);

    // Cleanup on unmount or when dependencies change:
    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
      lastTickTimeRef.current = null;
      lastFrameTimeRef.current = null;
    };
  }, [loop]);

  // Control functions:
  const pause = useCallback(() => {
    setIsPaused(true);
    if (debugMode) {
      console.log('[GameLoop Debug] Paused');
    }
  }, [debugMode]);

  const resume = useCallback(() => {
    setIsPaused(false);
    // Reset lastTickTime so that the elapsed time doesn't spike on resume.
    lastTickTimeRef.current = performance.now();
    if (debugMode) {
      console.log('[GameLoop Debug] Resumed');
    }
  }, [debugMode]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const newState = !prev;
      if (debugMode) {
        console.log(
          `[GameLoop Debug] Toggled pause. New state: ${newState ? 'Paused' : 'Running'}`,
        );
      }
      // If we are resuming, reset lastTickTime.
      if (!newState) {
        lastTickTimeRef.current = performance.now();
      }
      return newState;
    });
  }, [debugMode]);

  const resetTick = useCallback(() => {
    setTick(0);
    if (debugMode) {
      console.log('[GameLoop Debug] Tick counter reset');
    }
  }, [debugMode]);

  // Return the public API
  return {
    tick,
    deltaTime,
    isPaused,
    fps,
    togglePause,
    pause,
    resume,
    resetTick,
  };
}
