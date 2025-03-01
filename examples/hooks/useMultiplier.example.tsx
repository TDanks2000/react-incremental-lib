import React, { useState } from 'react';
import { useMultiplier } from 'react-incremental-library';

export const UseMultiplierExample = () => {
  const [baseValue, setBaseValue] = useState(10);
  const { multiplier, applyMultiplier, increaseMultiplier, resetMultiplier } =
    useMultiplier({
      baseValue,
      initialMultiplier: 1,
    });

  return (
    <div>
      <h1>Base Value: {baseValue}</h1>
      <h2>Multiplier: {multiplier}x</h2>
      <h2>Result: {applyMultiplier()}</h2>

      <button onClick={() => increaseMultiplier(1)}>Increase Multiplier</button>
      <button onClick={resetMultiplier}>Reset Multiplier</button>
    </div>
  );
};
