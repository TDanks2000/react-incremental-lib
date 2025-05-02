import React, { useState } from 'react';
import { useAchievements } from 'react-incremental-library';

export const UseAchievementsExample = () => {
  const [clicks, setClicks] = useState(0);

  const {
    allAchievements,
    getAchievement,
    getAchievementsByCategory,
    categories,
    completionPercentage,
  } = useAchievements(
    [
      {
        name: 'First Click',
        condition: clicks >= 1,
        onUnlock: () => console.log('Unlocked: First Click!'),
        category: 'Beginner',
        description: 'Click the button for the first time',
        icon: '🖱️',
      },
      {
        name: 'Five Clicks',
        condition: clicks >= 5,
        onUnlock: () => console.log('Unlocked: Five Clicks!'),
        category: 'Beginner',
        description: 'Click the button 5 times',
        icon: '✋',
        progressCurrent: Math.min(clicks, 5),
        progressTarget: 5,
      },
      {
        name: 'Ten Clicks',
        condition: clicks >= 10,
        onUnlock: () => console.log('Unlocked: Ten Clicks!'),
        category: 'Intermediate',
        description: 'Click the button 10 times',
        icon: '🔟',
        progressCurrent: Math.min(clicks, 10),
        progressTarget: 10,
      },
      {
        name: 'Secret Achievement',
        condition: clicks === 7,
        onUnlock: () => console.log('Unlocked: Secret Achievement!'),
        category: 'Hidden',
        description: 'Find the lucky number',
        icon: '🎲',
        hidden: true,
      },
    ],
    {
      onAchievementUnlocked: (name) => alert(`Achievement unlocked: ${name}`),
    },
  );

  // Calculate overall progress
  const overallProgress =
    allAchievements.reduce(
      (sum, achievement) => sum + achievement.progress,
      0,
    ) / allAchievements.length;

  return (
    <div>
      <h1>Achievements Example</h1>
      <p>Clicks: {clicks}</p>
      <button onClick={() => setClicks((prev) => prev + 1)}>Click Me</button>

      <h2>Overall Progress</h2>
      <div
        style={{
          width: '100%',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            width: `${completionPercentage}%`,
            backgroundColor: '#4caf50',
            height: '20px',
            borderRadius: '4px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <p>Completion: {completionPercentage.toFixed(0)}%</p>

      {categories.map((category) => (
        <div key={category}>
          <h2>{category} Achievements</h2>
          <ul>
            {getAchievementsByCategory(category).map((achievement) => {
              // Don't show hidden achievements unless unlocked
              if (achievement.hidden && !achievement.unlocked) return null;

              return (
                <li key={achievement.name} style={{ marginBottom: '10px' }}>
                  <div>
                    <strong>
                      {achievement.icon} {achievement.name}
                    </strong>
                    : {achievement.unlocked ? '✅' : '❌'}
                    <p>{achievement.description}</p>
                    {/* Progress bar */}
                    <div
                      style={{
                        width: '100%',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '4px',
                      }}
                    >
                      <div
                        style={{
                          width: `${achievement.progress * 100}%`,
                          backgroundColor: achievement.unlocked
                            ? '#4caf50'
                            : '#2196f3',
                          height: '10px',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                    <small>{(achievement.progress * 100).toFixed(0)}%</small>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <h2>Achievement Details</h2>
      <p>
        Five Clicks Achievement Details:
        <pre>{JSON.stringify(getAchievement('Five Clicks'), null, 2)}</pre>
      </p>
    </div>
  );
};
