# React Incremental Library API Reference

This documentation provides comprehensive information about all hooks and utilities available in the React Incremental Library. Each section includes detailed API references, usage examples, and best practices.

## Table of Contents

- [Game Mechanics](#game-mechanics)
- [Resource Management](#resource-management)
- [Progression Systems](#progression-systems)
- [Utility Hooks](#utility-hooks)

## Game Mechanics

Hooks for implementing core game loop mechanics and time-based progression.

- [useGameLoop](./game-mechanics/useGameLoop.md) - Core game loop with configurable tick rate and pause functionality
- [useAutoIncrement](./game-mechanics/useAutoIncrement.md) - Automatic resource incrementation over time
- [useIdleProgress](./game-mechanics/useIdleProgress.md) - Progress tracking for idle mechanics
- [useOfflineProgress](./game-mechanics/useOfflineProgress.md) - Calculate and apply progress while the game is closed
- [useTick](./game-mechanics/useTick.md) - Simple tick-based updates for game state

## Resource Management

Hooks for managing in-game resources, currencies, and production chains.

- [useCurrency](./resource-management/useCurrency.md) - Currency management with formatting options
- [useClicker](./resource-management/useClicker.md) - Click-based resource generation
- [useMultiplier](./resource-management/useMultiplier.md) - Apply and manage multipliers to resource generation
- [useProduction](./resource-management/useProduction.md) - Resource production chains and automation
- [useResourceCap](./resource-management/useResourceCap.md) - Resource capacity limits and upgrades

## Progression Systems

Hooks for implementing player progression mechanics.

- [useUpgrade](./progression/useUpgrade.md) - Purchasable upgrades with tiered support
- [useAchievement](./progression/useAchievement.md) - Individual achievement tracking
- [useAchievements](./progression/useAchievements.md) - Achievement system management
- [useCooldown](./progression/useCooldown.md) - Cooldown timers for abilities and actions
- [usePrestige](./progression/usePrestige.md) - Prestige mechanics for long-term progression

## Utility Hooks

Utility hooks for game development and player experience.

- [useSaveGame](./utility/useSaveGame.md) - Game state persistence
- [useLoadSaveGame](./utility/useLoadSaveGame.md) - Loading saved game states
- [useNotation](./utility/useNotation.md) - Number formatting for large values
- [useHotKey](./utility/useHotKey.md) - Keyboard shortcuts for game actions
- [useMemoization](./utility/useMemoization.md) - Performance optimization through memoization
