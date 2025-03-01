import React from 'react';
import { useClicker } from 'react-incremental-lib';

export const UseClickerExample = () => {
  const { count, handleClick } = useClicker({
    onClick: (val) => console.log(`Clicked! New count: ${val}`),
  });

  return (
    <div>
      <h1>Clicker Example</h1>
      <p>Click Count: {count}</p>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
};
