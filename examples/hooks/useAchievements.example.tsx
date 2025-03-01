import React, { useState } from 'react';
import { useAchievements } from 'react-incremental-lib';

export const UseAchievementsExample = () => {
  const [clicks, setClicks] = useState(0);
  const { allAchievements, getAchievement } = useAchievements([
    {
      name: 'First Click',
      condition: clicks >= 1,
      onUnlock: () => console.log('Unlocked: First Click!'),
    },
    {
      name: 'Five Clicks',
      condition: clicks >= 5,
      onUnlock: () => console.log('Unlocked: Five Clicks!'),
    },
  ]);

  return (
    <div>
      <h1>Achievements Example</h1>
      <p>Clicks: {clicks}</p>
      <button onClick={() => setClicks((prev) => prev + 1)}>Click Me</button>

      <h2>Unlocked Achievements:</h2>
      <ul>
        {allAchievements.map(({ name, unlocked }) => (
          <li key={name}>
            {name}: {unlocked ? '✅' : '❌'}
          </li>
        ))}
      </ul>

      <p>
        Specific Achievement (Five Clicks):{' '}
        {getAchievement('Five Clicks').unlocked ? '✅' : '❌'}
      </p>
    </div>
  );
};
