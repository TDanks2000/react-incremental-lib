import React, { useState } from 'react';
import { useCooldown } from 'react-incremental-library';

export const UseCooldownExample = () => {
  const [actionReady, setActionReady] = useState(true);
  const { isCoolingDown, remainingTime, startCooldown, resetCooldown } =
    useCooldown({
      duration: 5000,
    });

  const handleClick = () => {
    if (!isCoolingDown) {
      setActionReady(false);
      startCooldown();
    }
  };

  return (
    <div>
      <h1>Cooldown Example</h1>
      <button onClick={handleClick} disabled={isCoolingDown}>
        {isCoolingDown
          ? `Cooling Down: ${Math.ceil(remainingTime / 1000)}s`
          : 'Use Ability'}
      </button>
      <button onClick={resetCooldown}>Reset Cooldown</button>
    </div>
  );
};
