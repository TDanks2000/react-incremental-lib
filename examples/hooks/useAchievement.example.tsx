import React, { useState } from 'react';
import { useAchievement } from 'react-incremental-lib';

export const UseAchievementExample = () => {
  const [clicks, setClicks] = useState(0);
  const { unlocked } = useAchievement({
    name: 'First Click',
    condition: clicks >= 1,
    onUnlock: () => console.log('Achievement Unlocked: First Click!'),
  });

  return (
    <div>
      <h1>Achievement Example</h1>
      <p>Clicks: {clicks}</p>
      <button onClick={() => setClicks((prev) => prev + 1)}>Click Me</button>
      <p>{unlocked ? '🎉 Achievement Unlocked!' : 'Not unlocked yet'}</p>
    </div>
  );
};
