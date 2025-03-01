import React, { useState } from 'react';
import { useSaveGame } from 'react-incremental-library';

export const UseSaveGameExample = () => {
  const [gameState, setGameState] = useState({ score: 100, level: 2 });

  useSaveGame({
    data: gameState,
    onSave: () => console.log('Game Saved!'),
    onDiscard: () => console.log('Changes Discarded!'),
  });

  return (
    <div>
      <h1>Save Game Example</h1>
      <p>Score: {gameState.score}</p>
      <p>Level: {gameState.level}</p>
      <button
        onClick={() =>
          setGameState({ score: gameState.score + 10, level: gameState.level })
        }
      >
        Increase Score
      </button>
    </div>
  );
};
