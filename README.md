# 🕹️ React Incremental Game Library

A collection of **high-performance React hooks** designed for incremental, clicker, and idle games. 🚀

## ✨ Features

- Auto-incrementing resources
- Achievements tracking
- Clicker mechanics
- Game loop management
- Idle progression
- Resource caps & multipliers
- And more to come!

---

## 📦 Installation

```
[npm | bun | yarn | pnpm] add react-incremental-lib
```

---

## 🛠️ Usage

Each hook is designed with simplicity and flexibility in mind. Here are a few usage examples:

### 🔄 Game Loop (`useGameLoop`)

Runs a function at a fixed FPS to handle frame-based updates.

```
import { useGameLoop } from "react-incremental-lib";

useGameLoop({
  fps: 60,
  update: () => console.log("Game loop running!"),
});
```

---

### 🖱️ Clicker (`useClicker`)

Manages a click-based resource.

```
import { useClicker } from "react-incremental-lib";

const { count, handleClick } = useClicker({
  onClick: (val) => console.log("Clicked!", val)
});
```

---

### 🎖️ Achievements (`useAchievement`)

Tracks when a condition is met and unlocks achievements.

```
import { useAchievement } from "react-incremental-lib";

const { unlocked } = useAchievement({
  name: "First Click",
  condition: clicks >= 1,
  onUnlock: () => console.log("Unlocked!")
});
```

---

### 🔼 Auto-Increment (`useAutoIncrement`)

Increases currency automatically over time.

```
import { useAutoIncrement } from "react-incremental-lib";

const { pause, resume, isPaused } = useAutoIncrement({
  interval: 1000,
  increaseBy: 5,
  onAutoIncrement: (amount) => console.log(`Gained ${amount}!`)
});
```

---

### 💰 Resource Cap (`useResourceCap`)

Prevents resources from exceeding a maximum limit.

```
import { useResourceCap } from "react-incremental-lib";

const { resource, addResource, removeResource } = useResourceCap({
  initialValue: 50,
  max: 100
});
```

---

### 💤 Idle Progress (`useIdleProgress`)

Rewards players for time spent away.

```
import { useIdleProgress } from "react-incremental-lib";

const { idleGain } = useIdleProgress({ resourcePerSecond: 2 });
console.log(`You gained ${idleGain} resources while away!`);
```

---

## 📄 API Documentation

The following table lists the hooks available in the library. This list is designed to update automatically as new hooks and features are added. For a detailed look at each hook, please visit our [examples folder](./examples).

| Hook               | Description                                   |
| ------------------ | --------------------------------------------- |
| `useGameLoop`      | Runs a function at a fixed FPS.               |
| `useClicker`       | Manages click-based interactions.             |
| `useAchievement`   | Unlocks achievements when conditions are met. |
| `useAchievements`  | Tracks multiple achievements.                 |
| `useAutoIncrement` | Automates resource accumulation over time.    |
| `useResourceCap`   | Prevents resources from exceeding max limits. |
| `useIdleProgress`  | Rewards players for offline time.             |
| `useMultiplier`    | Applies multipliers to resource generation.   |
| `useSaveGame`      | Saves game state to local storage.            |
| `useLoadSaveGame`  | Loads saved game state from local storage.    |
| `useTick`          | Calls a function at a set interval.           |
| `useCooldown`      | Implements cooldown mechanics for actions.    |
| `useUpgrade`       | Handles game upgrades and purchases.          |

---

## 🎮 Contributing

PRs are welcome! If you have an idea for a new hook or an improvement, feel free to submit a request or open an issue. For usage examples, please refer to our [examples folder](./examples).

---

## ⚖️ License

MIT License © 2025 - Your Name

---

### 🚀 Start Building Your Incremental Game Today!
