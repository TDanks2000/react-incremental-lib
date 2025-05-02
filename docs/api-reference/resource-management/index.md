# Resource Management Hooks

Resource management hooks help you handle various types of resources in your incremental game, from basic currencies to complex production chains.

## Overview

Resource management is a core aspect of incremental games. These hooks provide tools for:

- Managing currencies and resources
- Handling clicking mechanics
- Implementing production multipliers
- Setting resource caps and limits

## Available Hooks

- [useClicker](#useclicker) - Implements basic clicking mechanics
- [useCurrency](#usecurrency) - Manages game currencies and resources
- [useMultiplier](#usemultiplier) - Handles production and earning multipliers
- [useResourceCap](#useresourcecap) - Implements maximum limits for resources
- [useProduction](#useproduction) - Manages resource production chains

## useClicker

`useClicker` provides a simple way to implement clicking mechanics in your game.

### Parameters

```typescript
interface UseClickerOptions {
  initialCount?: number; // Starting click count (default: 0)
  onClick?: (count: number) => void; // Callback when click occurs
  onReset?: () => void; // Callback when counter is reset
}
```

### Returns

```typescript
interface UseClickerReturn {
  count: number; // Current click count
  handleClick: () => void; // Function to trigger a click
  reset: () => void; // Function to reset click count
  setCount: (count: number) => void; // Function to set click count directly
}
```

### Example

```jsx
import { useClicker } from 'react-incremental-library';

const ClickerComponent = () => {
  const { count, handleClick } = useClicker({
    onClick: (newCount) => console.log(`Clicked! Count: ${newCount}`),
  });

  return (
    <div>
      <p>Clicks: {count}</p>
      <button onClick={handleClick}>Click me!</button>
    </div>
  );
};
```

## useCurrency

`useCurrency` manages a numeric currency or resource value with various utility functions.

### Parameters

```typescript
interface UseCurrencyOptions {
  initialValue?: number; // Starting currency amount (default: 0)
  currencyName?: string; // Name of the currency (optional)
  minValue?: number; // Minimum possible value (default: 0)
  maxValue?: number; // Maximum possible value (default: Infinity)
  onIncrease?: (amount: number, newValue: number) => void; // Callback on increase
  onDecrease?: (amount: number, newValue: number) => void; // Callback on decrease
  onReset?: () => void; // Callback on reset
  persistenceKey?: string; // Key for automatic persistence (optional)
}
```

### Returns

```typescript
interface UseCurrencyReturn {
  currency: number; // Current currency value
  increase: (amount: number) => void; // Function to add currency
  decrease: (amount: number) => void; // Function to subtract currency
  reset: () => void; // Function to reset to initial value
  setCurrency: (value: number) => void; // Function to set currency directly
  currencyName: string | undefined; // Name of the currency
  setCurrencyName: (name: string) => void; // Function to set currency name
  canAfford: (cost: number) => boolean; // Check if currency >= cost
}
```

### Example

```jsx
import { useCurrency } from 'react-incremental-library';

const CurrencyComponent = () => {
  const { currency, increase, decrease, currencyName, setCurrencyName } =
    useCurrency({
      initialValue: 100,
      currencyName: 'Gold',
      onIncrease: (amount, newValue) =>
        console.log(`Added ${amount} gold. New total: ${newValue}`),
    });

  return (
    <div>
      <p>
        {currencyName}: {currency}
      </p>
      <button onClick={() => increase(10)}>Add 10</button>
      <button onClick={() => decrease(5)}>Spend 5</button>
      <button onClick={() => setCurrencyName('Coins')}>Change to Coins</button>
    </div>
  );
};
```

## useMultiplier

`useMultiplier` manages a value that can multiply other values, useful for implementing production bonuses.

### Parameters

```typescript
interface UseMultiplierOptions {
  initialValue?: number; // Starting multiplier value (default: 1)
  minValue?: number; // Minimum possible value (default: 0)
  onChange?: (value: number) => void; // Callback when multiplier changes
}
```

### Returns

```typescript
interface UseMultiplierReturn {
  value: number; // Current multiplier value
  increase: (amount: number) => void; // Function to increase multiplier
  decrease: (amount: number) => void; // Function to decrease multiplier
  setValue: (value: number) => void; // Function to set multiplier directly
  reset: () => void; // Function to reset to initial value
  multiply: (value: number) => number; // Apply multiplier to a value
}
```

### Example

```jsx
import { useMultiplier, useCurrency } from 'react-incremental-library';

const MultiplierComponent = () => {
  const { value: multiplier, increase: increaseMultiplier } = useMultiplier({
    initialValue: 1,
  });

  const { currency, increase } = useCurrency({ initialValue: 0 });

  const handleClick = () => {
    // Apply multiplier to currency gain
    increase(10 * multiplier);
  };

  return (
    <div>
      <p>Currency: {currency}</p>
      <p>Multiplier: {multiplier}x</p>
      <button onClick={handleClick}>Earn Currency</button>
      <button onClick={() => increaseMultiplier(0.1)}>
        Increase Multiplier (+0.1)
      </button>
    </div>
  );
};
```

## useResourceCap

`useResourceCap` implements a maximum limit for a resource that can be upgraded.

### Parameters

```typescript
interface UseResourceCapOptions {
  initialCap?: number; // Starting cap value (default: 100)
  minCap?: number; // Minimum possible cap (default: 0)
  onCapIncrease?: (amount: number, newCap: number) => void; // Callback on cap increase
  onCapDecrease?: (amount: number, newCap: number) => void; // Callback on cap decrease
}
```

### Returns

```typescript
interface UseResourceCapReturn {
  cap: number; // Current resource cap
  increaseCap: (amount: number) => void; // Function to increase the cap
  decreaseCap: (amount: number) => void; // Function to decrease the cap
  setCap: (value: number) => void; // Function to set cap directly
  resetCap: () => void; // Function to reset to initial cap
  isAtCap: (value: number) => boolean; // Check if a value is at/above cap
  getAvailableSpace: (currentValue: number) => number; // Get space remaining
}
```

### Example

```jsx
import { useResourceCap, useCurrency } from 'react-incremental-library';

const ResourceCapComponent = () => {
  const { cap, increaseCap, isAtCap } = useResourceCap({
    initialCap: 100,
  });

  const { currency, increase } = useCurrency({
    initialValue: 0,
    maxValue: cap, // Link the currency to the resource cap
  });

  return (
    <div>
      <p>
        Currency: {currency} / {cap}
      </p>
      <button onClick={() => increase(10)} disabled={isAtCap(currency)}>
        Add 10
      </button>
      <button onClick={() => increaseCap(50)}>Upgrade Storage (+50)</button>
    </div>
  );
};
```

## useProduction

`useProduction` manages automatic resource production over time.

### Parameters

```typescript
interface UseProductionOptions {
  initialRate?: number; // Starting production rate (default: 1)
  targetResource?: (amount: number) => void; // Function to receive produced resources
  productionInterval?: number; // Milliseconds between production (default: 1000)
  autoStart?: boolean; // Whether to start production automatically (default: true)
  onProduce?: (amount: number) => void; // Callback when production occurs
}
```

### Returns

```typescript
interface UseProductionReturn {
  productionRate: number; // Current production rate per interval
  setProductionRate: (rate: number) => void; // Function to set production rate
  increaseProductionRate: (amount: number) => void; // Function to increase rate
  decreaseProductionRate: (amount: number) => void; // Function to decrease rate
  isProducing: boolean; // Whether production is active
  startProduction: () => void; // Function to start production
  stopProduction: () => void; // Function to stop production
  resetProduction: () => void; // Function to reset production rate
}
```

### Example

```jsx
import { useProduction, useCurrency } from 'react-incremental-library';

const ProductionComponent = () => {
  const { currency, increase } = useCurrency({ initialValue: 0 });

  const {
    productionRate,
    increaseProductionRate,
    isProducing,
    startProduction,
    stopProduction,
  } = useProduction({
    initialRate: 1,
    targetResource: increase, // Production adds to currency
    productionInterval: 1000, // Produce every second
  });

  return (
    <div>
      <p>Currency: {currency}</p>
      <p>Production Rate: {productionRate} per second</p>
      <button onClick={() => increaseProductionRate(1)}>
        Upgrade Production (+1)
      </button>
      {isProducing ? (
        <button onClick={stopProduction}>Pause Production</button>
      ) : (
        <button onClick={startProduction}>Resume Production</button>
      )}
    </div>
  );
};
```

## Related Hooks

- [useGameLoop](../game-mechanics/useGameLoop.md) - For more control over game timing
- [useAutoIncrement](../game-mechanics/useAutoIncrement.md) - For simpler automatic resource generation
- [useUpgrade](../progression/useUpgrade.md) - For implementing purchasable upgrades
