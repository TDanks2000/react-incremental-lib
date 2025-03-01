import React from 'react';
import { useLoadSaveGame } from 'react-incremental-lib';

export const UseLoadSaveGameExample = () => {
  const gameData = useLoadSaveGame<{ score: number; level: number }>();

  return (
    <div>
      <h1>Saved Game Data</h1>
      <p>Score: {gameData?.score ?? 'No Data'}</p>
      <p>Level: {gameData?.level ?? 'No Data'}</p>
    </div>
  );
};
