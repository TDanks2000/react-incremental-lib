import React, { useState } from 'react';
import { useIdleProgress } from 'react-incremental-lib';

export const UseIdleProgressExample = () => {
  const { idleGain } = useIdleProgress({ resourcePerSecond: 2 });
  const [totalResource, setTotalResource] = useState(0);

  return (
    <div>
      <h1>Idle Progress Example</h1>
      <p>You gained {idleGain.toFixed(2)} resources while away!</p>
      <button onClick={() => setTotalResource((prev) => prev + idleGain)}>
        Collect Idle Resources
      </button>
      <p>Total Resource: {totalResource}</p>
    </div>
  );
};
