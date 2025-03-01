import React, { useState } from 'react';
import { useGameLoop } from 'react-incremental-lib';

export const UseGameLoopExample = () => {
  const [frameCount, setFrameCount] = useState(0);

  useGameLoop({
    fps: 30, // Updates 30 times per second
    update: () => setFrameCount((prev) => prev + 1),
  });

  return (
    <div>
      <h1>Game Loop Example</h1>
      <p>Frame Count: {frameCount}</p>
    </div>
  );
};
