# Tutorial: Building a Basic Clicker Game

This tutorial will guide you through creating a simple clicker game using React Incremental Library. By the end, you'll have a functional game with clicking mechanics, automatic production, upgrades, and save functionality.

## Prerequisites

- Basic knowledge of React and TypeScript
- React Incremental Library installed in your project

```bash
npm install react-incremental-lib
```

## Step 1: Setting Up the Game Loop

First, let's create the basic structure of our game with a game loop:

```tsx
import React, { useState } from 'react';
import { useGameLoop, useCurrency, useClicker } from 'react-incremental-lib';

function ClickerGame() {
  // Set up the game loop with a 100ms tick rate (10 ticks per second)
  const { tick, isPaused, togglePause } = useGameLoop({
    tickRate: 100,
    startPaused: false,
  });

  return (
    <div className="clicker-game">
      <h1>My Clicker Game</h1>
      <p>Tick: {tick}</p>
      <button onClick={togglePause}>
        {isPaused ? 'Resume' : 'Pause'} Game
      </button>

      {/* We'll add more components here */}
    </div>
  );
}

export default ClickerGame;
```

## Step 2: Adding Currency and Clicking Mechanics

Next, let's add a currency (coins) and clicking functionality:

```tsx
import React from 'react';
import {
  useGameLoop,
  useCurrency,
  useClicker,
  useNotation,
} from 'react-incremental-lib';

function ClickerGame() {
  const { tick, isPaused, togglePause } = useGameLoop({
    tickRate: 100,
    startPaused: false,
  });

  // Set up our currency with formatting
  const { value: coins, increase: addCoins } = useCurrency({
    initialValue: 0,
    name: 'coins',
  });

  // Set up clicking mechanics
  const { handleClick, clickPower } = useClicker({
    onClick: () => addCoins(clickPower),
    initialClickPower: 1,
  });

  // Format large numbers
  const { format } = useNotation();

  return (
    <div className="clicker-game">
      <h1>My Clicker Game</h1>
      <p>Coins: {format(coins)}</p>

      <button
        onClick={handleClick}
        className="clicker-button"
        disabled={isPaused}
      >
        Click for +{clickPower} coins
      </button>

      <button onClick={togglePause}>
        {isPaused ? 'Resume' : 'Pause'} Game
      </button>
    </div>
  );
}

export default ClickerGame;
```

## Step 3: Adding Automatic Production

Let's add automatic production of coins using the `useAutoIncrement` hook:

```tsx
import React from 'react';
import {
  useGameLoop,
  useCurrency,
  useClicker,
  useNotation,
  useAutoIncrement,
} from 'react-incremental-lib';

function ClickerGame() {
  // Game loop setup
  const { tick, isPaused, togglePause } = useGameLoop({
    tickRate: 100,
    startPaused: false,
  });

  // Currency setup
  const { currency: coins, increase: addCoins } = useCurrency({
    initialValue: 0,
    name: 'coins',
  });

  // Clicking mechanics
  const { handleClick, clickPower, setClickPower } = useClicker({
    onClick: () => addCoins(clickPower),
    initialClickPower: 1,
  });

  // Auto production setup
  const [autoProducers, setAutoProducers] = React.useState(0);
  const autoRate = autoProducers * 0.1; // Each producer generates 0.1 coins per tick

  useAutoIncrement({
    enabled: !isPaused && autoProducers > 0,
    increment: autoRate,
    onIncrement: (amount) => addCoins(amount),
    tickRate: 100, // Match the game loop tick rate
  });

  // Buy an auto producer
  const buyAutoProducer = () => {
    const cost = 10 * Math.pow(1.5, autoProducers);
    if (coins >= cost) {
      addCoins(-cost);
      setAutoProducers((prev) => prev + 1);
    }
  };

  // Format large numbers
  const { format } = useNotation();

  return (
    <div className="clicker-game">
      <h1>My Clicker Game</h1>
      <p>Coins: {format(coins)}</p>

      <button
        onClick={handleClick}
        className="clicker-button"
        disabled={isPaused}
      >
        Click for +{clickPower} coins
      </button>

      <div className="producers">
        <h2>Auto Producers</h2>
        <p>
          You have {autoProducers} producers generating {format(autoRate * 10)}{' '}
          coins per second
        </p>
        <button
          onClick={buyAutoProducer}
          disabled={coins < 10 * Math.pow(1.5, autoProducers) || isPaused}
        >
          Buy Producer ({format(10 * Math.pow(1.5, autoProducers))} coins)
        </button>
      </div>

      <button onClick={togglePause}>
        {isPaused ? 'Resume' : 'Pause'} Game
      </button>
    </div>
  );
}

export default ClickerGame;
```

## Step 4: Adding Upgrades

Now let's add upgrades to increase click power using the `useUpgrade` hook:

```tsx
import React from 'react';
import {
  useGameLoop,
  useCurrency,
  useClicker,
  useNotation,
  useAutoIncrement,
  useUpgrade,
} from 'react-incremental-lib';

function ClickerGame() {
  // Previous code...

  // Upgrade system for click power
  const clickUpgrade = useUpgrade({
    name: 'Better Clicks',
    description: 'Double your click power',
    maxLevel: 5,
    baseCost: 50,
    costMultiplier: 3,
    onPurchase: (level) => {
      // Double click power with each upgrade
      setClickPower(Math.pow(2, level));
    },
    currency: {
      value: coins,
      subtract: (amount) => addCoins(-amount),
    },
  });

  return (
    <div className="clicker-game">
      {/* Previous UI elements */}

      <div className="upgrades">
        <h2>Upgrades</h2>
        <div className="upgrade-item">
          <div>
            <h3>
              {clickUpgrade.name} (Level {clickUpgrade.level})
            </h3>
            <p>{clickUpgrade.description}</p>
            <p>Current: +{clickPower} coins per click</p>
            {clickUpgrade.level < clickUpgrade.maxLevel ? (
              <p>
                Next: +{Math.pow(2, clickUpgrade.level + 1)} coins per click
              </p>
            ) : (
              <p>Max level reached!</p>
            )}
          </div>
          <button
            onClick={clickUpgrade.purchase}
            disabled={
              !clickUpgrade.canPurchase ||
              isPaused ||
              clickUpgrade.level >= clickUpgrade.maxLevel
            }
          >
            {clickUpgrade.level < clickUpgrade.maxLevel
              ? `Upgrade (${format(clickUpgrade.currentCost)} coins)`
              : 'Maxed Out'}
          </button>
        </div>
      </div>

      {/* Rest of the UI */}
    </div>
  );
}

export default ClickerGame;
```

## Step 5: Adding Save/Load Functionality

Finally, let's add save and load functionality to persist game progress:

```tsx
import React, { useEffect } from 'react';
import {
  useGameLoop,
  useCurrency,
  useClicker,
  useNotation,
  useAutoIncrement,
  useUpgrade,
  useSaveGame,
  useLoadSaveGame,
} from 'react-incremental-lib';

function ClickerGame() {
  // Game state
  const [autoProducers, setAutoProducers] = React.useState(0);

  // Game loop setup
  const { tick, isPaused, togglePause } = useGameLoop({
    tickRate: 100,
    startPaused: false,
  });

  // Currency setup
  const { currency: coins, increase: addCoins } = useCurrency({
    initialValue: 0,
    name: 'coins',
  });

  // Clicking mechanics
  const { handleClick, clickPower, setClickPower } = useClicker({
    onClick: () => addCoins(clickPower),
    initialClickPower: 1,
  });

  // Auto production setup
  const autoRate = autoProducers * 0.1;

  useAutoIncrement({
    enabled: !isPaused && autoProducers > 0,
    increment: autoRate,
    onIncrement: (amount) => addCoins(amount),
    tickRate: 100,
  });

  // Upgrade system for click power
  const clickUpgrade = useUpgrade({
    name: 'Better Clicks',
    description: 'Double your click power',
    maxLevel: 5,
    baseCost: 50,
    costMultiplier: 3,
    onPurchase: (level) => {
      setClickPower(Math.pow(2, level));
    },
    currency: {
      value: coins,
      subtract: (amount) => addCoins(-amount),
    },
  });

  // Save game functionality
  const { saveGame } = useSaveGame({
    key: 'my-clicker-game',
    data: {
      coins,
      clickPower,
      autoProducers,
      clickUpgradeLevel: clickUpgrade.level,
    },
    autosave: true,
    autosaveInterval: 30000, // Autosave every 30 seconds
  });

  // Load game functionality
  const { loadGame, hasExistingSave } = useLoadSaveGame({
    key: 'my-clicker-game',
    onLoad: (data) => {
      if (data) {
        setCoins(data.coins || 0);
        setClickPower(data.clickPower || 1);
        setAutoProducers(data.autoProducers || 0);

        // Restore upgrade level
        if (data.clickUpgradeLevel) {
          for (let i = 0; i < data.clickUpgradeLevel; i++) {
            clickUpgrade.forcePurchase();
          }
        }
      }
    },
  });

  // Load save on first mount
  useEffect(() => {
    if (hasExistingSave) {
      loadGame();
    }
  }, [hasExistingSave, loadGame]);

  // Buy an auto producer
  const buyAutoProducer = () => {
    const cost = 10 * Math.pow(1.5, autoProducers);
    if (coins >= cost) {
      addCoins(-cost);
      setAutoProducers((prev) => prev + 1);
    }
  };

  // Format large numbers
  const { format } = useNotation();

  return (
    <div className="clicker-game">
      <h1>My Clicker Game</h1>
      <p>Coins: {format(coins)}</p>

      <button
        onClick={handleClick}
        className="clicker-button"
        disabled={isPaused}
      >
        Click for +{clickPower} coins
      </button>

      <div className="producers">
        <h2>Auto Producers</h2>
        <p>
          You have {autoProducers} producers generating {format(autoRate * 10)}{' '}
          coins per second
        </p>
        <button
          onClick={buyAutoProducer}
          disabled={coins < 10 * Math.pow(1.5, autoProducers) || isPaused}
        >
          Buy Producer ({format(10 * Math.pow(1.5, autoProducers))} coins)
        </button>
      </div>

      <div className="upgrades">
        <h2>Upgrades</h2>
        <div className="upgrade-item">
          <div>
            <h3>
              {clickUpgrade.name} (Level {clickUpgrade.level})
            </h3>
            <p>{clickUpgrade.description}</p>
            <p>Current: +{clickPower} coins per click</p>
            {clickUpgrade.level < clickUpgrade.maxLevel ? (
              <p>
                Next: +{Math.pow(2, clickUpgrade.level + 1)} coins per click
              </p>
            ) : (
              <p>Max level reached!</p>
            )}
          </div>
          <button
            onClick={clickUpgrade.purchase}
            disabled={
              !clickUpgrade.canPurchase ||
              isPaused ||
              clickUpgrade.level >= clickUpgrade.maxLevel
            }
          >
            {clickUpgrade.level < clickUpgrade.maxLevel
              ? `Upgrade (${format(clickUpgrade.currentCost)} coins)`
              : 'Maxed Out'}
          </button>
        </div>
      </div>

      <div className="game-controls">
        <button onClick={togglePause}>
          {isPaused ? 'Resume' : 'Pause'} Game
        </button>
        <button onClick={saveGame}>Save Game</button>
        <button onClick={loadGame} disabled={!hasExistingSave}>
          Load Game
        </button>
      </div>
    </div>
  );
}

export default ClickerGame;
```

## Conclusion

Congratulations! You've built a basic clicker game with:

- A core game loop
- Currency and clicking mechanics
- Automatic production
- An upgrade system
- Save/load functionality

This tutorial demonstrates the fundamental patterns used in incremental games. From here, you can expand your game by:

- Adding more types of producers
- Creating additional upgrades
- Implementing achievements
- Adding prestige mechanics
- Enhancing the UI with animations and effects

Check out the other tutorials and API documentation to learn more about implementing these advanced features.

## Next Steps

- [Advanced Tutorial: Implementing Prestige Systems](./prestige-system.md)
- [Tutorial: Creating an Achievement System](./achievement-system.md)
- [API Reference: useUpgrade](../api-reference/progression/useUpgrade.md)
