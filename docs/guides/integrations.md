# Integration Guides

## UI Library Integrations

### Material-UI (MUI)

```tsx
import { useGameLoop } from 'react-incremental-lib';
import { Button, Typography } from '@mui/material';

const ClickerGame = () => {
  const { value, increment } = useGameLoop();

  return (
    <div>
      <Typography variant="h4">{value}</Typography>
      <Button variant="contained" onClick={increment}>
        Click Me
      </Button>
    </div>
  );
};
```

### Chakra UI

```tsx
import { useGameLoop } from 'react-incremental-lib';
import { Button, Text } from '@chakra-ui/react';

const ClickerGame = () => {
  const { value, increment } = useGameLoop();

  return (
    <div>
      <Text fontSize="2xl">{value}</Text>
      <Button colorScheme="blue" onClick={increment}>
        Click Me
      </Button>
    </div>
  );
};
```

### Tailwind CSS

```tsx
import { useGameLoop } from 'react-incremental-lib';

const ClickerGame = () => {
  const { value, increment } = useGameLoop();

  return (
    <div className="p-4">
      <div className="text-2xl font-bold">{value}</div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={increment}
      >
        Click Me
      </button>
    </div>
  );
};
```

## State Management Integrations

### Redux

```tsx
import { useGameLoop } from 'react-incremental-lib';
import { useDispatch, useSelector } from 'react-redux';

// Redux actions
const incrementValue = (amount) => ({
  type: 'INCREMENT_VALUE',
  payload: amount,
});

// Component
const ClickerGame = () => {
  const dispatch = useDispatch();
  const value = useSelector((state) => state.game.value);
  const { increment } = useGameLoop({
    onIncrement: (amount) => dispatch(incrementValue(amount)),
  });

  return (
    <div>
      <div>{value}</div>
      <button onClick={increment}>Click Me</button>
    </div>
  );
};
```

### Zustand

```tsx
import { useGameLoop } from 'react-incremental-lib';
import create from 'zustand';

const useStore = create((set) => ({
  value: 0,
  increment: (amount) => set((state) => ({ value: state.value + amount })),
}));

const ClickerGame = () => {
  const { value, increment: storeIncrement } = useStore();
  const { increment } = useGameLoop({
    onIncrement: storeIncrement,
  });

  return (
    <div>
      <div>{value}</div>
      <button onClick={increment}>Click Me</button>
    </div>
  );
};
```

### Jotai

```tsx
import { useGameLoop } from 'react-incremental-lib';
import { atom, useAtom } from 'jotai';

const valueAtom = atom(0);

const ClickerGame = () => {
  const [value, setValue] = useAtom(valueAtom);
  const { increment } = useGameLoop({
    onIncrement: (amount) => setValue((v) => v + amount),
  });

  return (
    <div>
      <div>{value}</div>
      <button onClick={increment}>Click Me</button>
    </div>
  );
};
```

## Game Engine Integrations

### Phaser

```tsx
import { useGameLoop } from 'react-incremental-lib';
import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Phaser game setup
  }

  update() {
    // Game loop updates
  }
}

const Game = () => {
  const { value } = useGameLoop();

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: GameScene,
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div>
      <div id="phaser-game" />
      <div>Score: {value}</div>
    </div>
  );
};
```

## Best Practices

1. Keep UI components separate from game logic
2. Use consistent state management patterns
3. Implement proper cleanup in useEffect hooks
4. Follow UI library's design guidelines
5. Maintain type safety with TypeScript

## Performance Considerations

1. Use proper memoization techniques
2. Implement virtualization for large lists
3. Optimize render cycles
4. Profile and monitor performance

## Troubleshooting

1. Check version compatibility
2. Review integration documentation
3. Submit issues on GitHub
