import React from 'react';
import { useAutoIncrement, useCurrency } from 'react-incremental-lib';

export const UseAutoIncrementExample = () => {
  const { currency } = useCurrency();

  const { pause, resume, isPaused } = useAutoIncrement({
    interval: 1000,
    increaseBy: 5,
    options: { startPaused: false },
    onAutoIncrement: (amount) => console.log('Auto-incremented by', amount),
    onPause: () => console.log('Auto-increment paused!'),
    onResume: () => console.log('Auto-increment resumed! by '),
  });

  return (
    <div>
      <h1>Auto-Increment Example</h1>
      <p>Currency: {currency}</p>
      <button onClick={isPaused ? resume : pause}>
        {isPaused ? 'Resume' : 'Pause'}
      </button>
    </div>
  );
};
