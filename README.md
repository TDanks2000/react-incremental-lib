# 🕹️ React Incremental Game Library

<div align="center" style="display: flex; justify-content: center; gap: 0.5rem; margin: 1rem 0;">

[![NPM Version](https://img.shields.io/npm/v/react-incremental-library)](https://www.npmjs.com/package/react-incremental-library)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

A powerful React library for building incremental, idle, and clicker games. Create engaging experiences with minimal setup using our collection of specialized hooks and stores.

## 🚀 Features

- 🎮 **Game Mechanics** - Clickers, auto-incrementers, and cooldown systems
- 💰 **Resource Management** - Currency systems and resource caps
- 🏆 **Progression Systems** - Achievements and upgrades
- 💾 **Save Systems** - Built-in game save/load functionality
- ⚡ **Performance Optimized** - Built with React 19 and Zustand
- 📱 **TypeScript Ready** - Full type support out of the box

## 📦 Installation

```bash
npm install react-incremental-library
# or
yarn add react-incremental-library
# or
pnpm add react-incremental-library
# or
bun add react-incremental-library
```

## 🎮 Quick Start

### Basic Clicker Example
```tsx
import React from 'react';
import { useClicker } from 'react-incremental-library';

export const ClickerGame = () => {
  const { count, handleClick } = useClicker({
    onClick: (val) => console.log(`Clicked! New count: ${val}`),
  });

  return (
    <div>
      <h1>Clicker Game</h1>
      <p>Click Count: {count}</p>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
};
```

### Auto-Increment Example
```tsx
import React from 'react';
import { useAutoIncrement, useCurrency } from 'react-incremental-library';

export const IdleGame = () => {
  const { currency } = useCurrency();
  const { pause, resume, isPaused } = useAutoIncrement({
    interval: 1000,
    increaseBy: 5,
    options: { startPaused: false },
  });

  return (
    <div>
      <h1>Idle Game</h1>
      <p>Currency: {currency}</p>
      <button onClick={isPaused ? resume : pause}>
        {isPaused ? 'Resume' : 'Pause'}
      </button>
    </div>
  );
};
```

## 📚 Available Hooks



### Game Mechanics
- `useClicker` - Basic clicking mechanics
- `useAutoIncrement` - Automatic resource generation
- `useGameLoop` - Game loop management
- `useTick` - Fine-grained timing control
- `useIdleProgress` - Track and reward idle time
- `useOfflineProgress` - Handle offline progression

### Resource Management
- `useCurrency` - Currency management
- `useProduction` - Resource production system
- `useResourceCap` - Resource capacity limits
- `useMultiplier` - Resource multipliers

### Progression Systems
- `useAchievement` - Individual achievement tracking
- `useAchievements` - Bulk achievement management
- `useUpgrade` - Upgrade system
- `usePrestige` - Prestige mechanics
- `useCooldown` - Action cooldown system

### Utility
- `useHotKey` - Keyboard shortcuts and combinations
- `useLoadSaveGame` - Load game progress
- `useSaveGame` - Save game progress
- `useNotation` - Number formatting utilities

## 🏗️ Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ❤️

[Reminder that you are great, you are enough, and your presence is valued. If you are struggling with your mental health, please reach out to someone you love and consult a professional. You are not alone; there is a large range of resources online for support and guidance.](https://tdanks.com/mental-health/quote)
