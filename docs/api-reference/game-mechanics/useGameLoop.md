# useGameLoop

`useGameLoop` is the core hook for implementing the main game loop in incremental games. It provides a configurable tick system with pause functionality and performance monitoring.

## API Reference

```typescript
function useGameLoop(options?: GameLoopOptions): GameLoopReturn;

interface GameLoopOptions {
  tickRate?: number; // Milliseconds between ticks (default: 1000)
  startPaused?: boolean; // Whether to start in paused state (default: false)
  maxTickTime?: number; // Maximum time a tick can take before throttling (default: 16)
  catchupThreshold?: number; // Maximum number of ticks to process when catching up (default: 10)
  onTick?: (delta: number) => void; // Callback function executed on each tick
  debugMode?: boolean; // Enable performance logging (default: false)
}

interface GameLoopReturn {
  tick: number; // Current tick count
  deltaTime: number; // Time since last tick in milliseconds
  isPaused: boolean; // Current pause state
  fps: number; // Current frames per second
  togglePause: () => void; // Toggle pause state
  pause: () => void; // Pause the game loop
  resume: () => void; // Resume the game loop
  resetTick: () => void; // Reset tick counter to zero
}
```

## Usage Examples

### Basic Usage

```tsx
import { useGameLoop } from 'react-incremental-lib';

function Game() {
  const { tick, isPaused, togglePause } = useGameLoop();

  return (
    <div>
      <p>Current tick: {tick}</p>
      <button onClick={togglePause}>{isPaused ? 'Resume' : 'Pause'}</button>
    </div>
  );
}
```

### Custom Tick Rate

```tsx
import { useGameLoop } from 'react-incremental-lib';

function FastGame() {
  // Run the game at 10 ticks per second
  const { tick } = useGameLoop({ tickRate: 100 });

  return <div>Fast game tick: {tick}</div>;
}
```

### With Tick Callback

```tsx
import { useState } from 'react';
import { useGameLoop } from 'react-incremental-lib';

function ResourceGame() {
  const [resources, setResources] = useState(0);

  const { isPaused } = useGameLoop({
    tickRate: 1000,
    onTick: (delta) => {
      // Add resources based on time passed
      setResources((prev) => prev + delta / 1000);
    },
  });

  return (
    <div>
      <p>Resources: {resources.toFixed(2)}</p>
      <p>{isPaused ? 'Game paused' : 'Game running'}</p>
    </div>
  );
}
```

### With Debug Mode

```tsx
import { useGameLoop } from 'react-incremental-lib';

function DebugGame() {
  const { fps } = useGameLoop({
    debugMode: true, // Enables performance logging
    tickRate: 50,
  });

  return (
    <div>
      <p>Current FPS: {fps.toFixed(1)}</p>
      <p>Check console for performance logs</p>
    </div>
  );
}
```

## Best Practices

1. **Choose an appropriate tick rate**: For most incremental games, a tick rate of 100ms-1000ms works well. Faster tick rates provide smoother updates but consume more resources.

2. **Handle pausing properly**: When the game is paused, make sure to also pause any animations or side effects that should not continue during pause.

3. **Use the deltaTime parameter**: For time-based calculations, always use the deltaTime parameter to ensure consistent gameplay regardless of actual frame rate.

4. **Optimize your tick handler**: The onTick callback should be as efficient as possible to prevent performance issues.

5. **Consider using debugMode during development**: This helps identify performance bottlenecks in your game loop.

## Common Issues and Solutions

### High CPU Usage

**Problem**: The game loop is consuming too much CPU.

**Solution**: Increase the tickRate value to reduce update frequency, or optimize the code in your onTick handler.

### Inconsistent Game Speed

**Problem**: The game runs at different speeds on different devices.

**Solution**: Always base calculations on deltaTime rather than assuming fixed intervals between ticks.

### Game Freezing

**Problem**: The game occasionally freezes or becomes unresponsive.

**Solution**: Check for expensive operations in your tick handler. Consider using the catchupThreshold option to limit catch-up ticks after lag.

## Related Hooks

- [useTick](./useTick.md) - A simpler version for basic tick-based updates
- [useIdleProgress](./useIdleProgress.md) - For tracking progress during idle periods
- [useOfflineProgress](./useOfflineProgress.md) - For calculating progress while the game is closed
