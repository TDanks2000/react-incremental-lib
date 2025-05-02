# Troubleshooting Guide for React Incremental Library

This guide addresses common issues you might encounter when developing incremental games with the React Incremental Library and provides solutions to help you resolve them.

## Table of Contents

1. [Performance Issues](#performance-issues)
2. [State Management Problems](#state-management-problems)
3. [Save/Load Functionality](#saveload-functionality)
4. [Game Balance Issues](#game-balance-issues)
5. [UI Update Problems](#ui-update-problems)
6. [Hook Integration Challenges](#hook-integration-challenges)

## Performance Issues

### Problem: Game becomes laggy as numbers increase

**Symptoms:**

- UI updates become slow
- Clicking feels unresponsive
- Frame rate drops significantly

**Solutions:**

1. **Use memoization:**

   ```jsx
   import { useMemoization } from 'react-incremental-library';

   // Memoize expensive calculations
   const { memoize } = useMemoization();
   const expensiveValue = memoize(
     'uniqueKey',
     () => calculateExpensiveValue(),
     [dependency1, dependency2],
   );
   ```

2. **Optimize render cycles:**

   - Use React.memo for components that render frequently
   - Avoid unnecessary re-renders by carefully managing dependencies
   - Consider using useCallback for functions passed to child components

3. **Adjust game loop tick rate:**

   ```jsx
   useGameLoop({
     onTick: handleTick,
     tickRate: 200, // Increase from default 100ms to reduce update frequency
   });
   ```

4. **Batch updates for large numbers of entities:**
   - Process entities in chunks rather than individually
   - Use requestAnimationFrame for visual updates

## State Management Problems

### Problem: State updates not reflecting correctly

**Symptoms:**

- Values don't update as expected
- Game mechanics seem to work incorrectly
- Inconsistent behavior between components

**Solutions:**

1. **Check hook dependencies:**

   ```jsx
   // Incorrect - missing dependency
   useEffect(() => {
     // Effect using currency
   }, []); // Missing currency dependency

   // Correct
   useEffect(() => {
     // Effect using currency
   }, [currency]); // Properly including dependency
   ```

2. **Use functional updates:**

   ```jsx
   // Incorrect - may use stale state
   const handleClick = () => setCurrency(currency + amount);

   // Correct - uses latest state value
   const handleClick = () => setCurrency((prev) => prev + amount);
   ```

3. **Ensure proper hook order:**

   - Hooks must be called in the same order on every render
   - Don't call hooks inside conditions or loops

4. **Check for race conditions:**
   - Use useEffect cleanup functions to cancel pending operations
   - Consider using a state management library for complex state

## Save/Load Functionality

### Problem: Game progress not saving or loading correctly

**Symptoms:**

- Game progress is lost on refresh
- Saved values are incorrect or corrupted
- Loading causes unexpected behavior

**Solutions:**

1. **Verify storage implementation:**

   ```jsx
   // Check if localStorage is available
   const isStorageAvailable = () => {
     try {
       localStorage.setItem('test', 'test');
       localStorage.removeItem('test');
       return true;
     } catch (e) {
       return false;
     }
   };
   ```

2. **Ensure complete state capture:**

   ```jsx
   const { saveGame } = useSaveGame({
     key: 'game-save',
     data: {
       // Include ALL relevant state
       currency,
       upgrades,
       achievements,
       // Include derived values that are expensive to recalculate
       productionRate,
     },
   });
   ```

3. **Handle data migration for version changes:**

   ```jsx
   const { loadGame } = useLoadSaveGame({
     key: 'game-save',
     onLoad: (data) => {
       if (!data) return;

       // Handle version migration
       if (data.version === 1) {
         // Convert v1 format to current format
         data = migrateFromV1(data);
       }

       // Apply data
       setCurrency(data.currency || 0);
       // ...
     },
   });
   ```

4. **Implement save validation:**
   - Add checksums or validation logic to detect corrupted saves
   - Provide fallback mechanisms for invalid saves

## Game Balance Issues

### Problem: Game progression feels too fast or too slow

**Symptoms:**

- Players reach endgame too quickly
- Progress feels impossibly slow
- Certain features are never used

**Solutions:**

1. **Implement dynamic cost scaling:**

   ```jsx
   const upgrade = useUpgrade({
     cost: 10,
     costMultiplier: 1.15, // Adjust this value to balance progression
     // Lower values (1.1-1.2) for slower scaling
     // Higher values (1.3-1.5) for faster scaling
   });
   ```

2. **Use production multipliers with diminishing returns:**

   ```jsx
   const calculateMultiplier = (level) => {
     // Diminishing returns formula
     return 1 + (level * 0.1) / (1 + level * 0.01);
   };
   ```

3. **Add prestige mechanics for long-term balance:**

   ```jsx
   const { prestige, prestigeMultiplier } = usePrestige({
     requiredCurrency: 1e6, // Adjust based on game pace
     multiplierPerPrestige: 0.1, // +10% per prestige
   });
   ```

4. **Implement analytics to track player progression:**
   - Collect data on how quickly players reach milestones
   - Adjust game parameters based on actual player behavior

## UI Update Problems

### Problem: UI doesn't reflect current game state

**Symptoms:**

- Display values don't match actual values
- UI elements don't update when they should
- Visual glitches or flickering

**Solutions:**

1. **Format large numbers appropriately:**

   ```jsx
   const { format } = useNotation();

   // In your JSX
   <div>Cookies: {format(cookies)}</div>;
   ```

2. **Use key props for lists:**

   ```jsx
   // Incorrect - using index as key
   {
     upgrades.map((upgrade, index) => (
       <UpgradeItem key={index} upgrade={upgrade} />
     ));
   }

   // Correct - using unique identifier
   {
     upgrades.map((upgrade) => (
       <UpgradeItem key={upgrade.id} upgrade={upgrade} />
     ));
   }
   ```

3. **Implement debouncing for rapidly changing values:**

   ```jsx
   const [displayValue, setDisplayValue] = useState(actualValue);

   useEffect(() => {
     const timer = setTimeout(() => {
       setDisplayValue(actualValue);
     }, 100);
     return () => clearTimeout(timer);
   }, [actualValue]);
   ```

4. **Use CSS transitions for smoother updates:**

   ```css
   .currency-value {
     transition: color 0.3s;
   }

   .currency-value.increased {
     color: green;
   }
   ```

## Hook Integration Challenges

### Problem: Hooks don't work well together

**Symptoms:**

- Unexpected interactions between different hooks
- Features interfere with each other
- Complex game mechanics don't work as expected

**Solutions:**

1. **Understand hook dependencies:**

   - Review the documentation for each hook to understand its dependencies
   - Ensure hooks that depend on each other are used in the correct order

2. **Create custom composite hooks:**

   ```jsx
   // Combine multiple hooks into a single custom hook
   const useResourceProduction = (initialValue = 0) => {
     const currency = useCurrency({ initialValue });
     const multiplier = useMultiplier({ initialValue: 1 });
     const autoIncrement = useAutoIncrement({
       incrementAmount: 1 * multiplier.value,
     });

     useGameLoop({
       onTick: (delta) => {
         currency.increase(autoIncrement.value * (delta / 1000));
       },
     });

     return {
       ...currency,
       multiplier,
       autoIncrement,
     };
   };
   ```

3. **Use middleware for cross-cutting concerns:**

   ```jsx
   import { createMiddleware } from 'react-incremental-library/stores';

   // Create logging middleware
   const loggingMiddleware = createMiddleware({
     onAction: (action, next) => {
       console.log('Action:', action);
       return next(action);
     },
   });

   // Apply to hooks that support middleware
   const { currency } = useCurrency({
     middleware: [loggingMiddleware],
   });
   ```

4. **Isolate complex mechanics:**
   - Break down complex game systems into smaller, manageable components
   - Use React context to share state between related components

---

If you encounter issues not covered in this guide, please check the API reference documentation for specific hooks or reach out to the community for support. Remember that incremental games often involve complex state management and mathematical progressions, so thorough testing is essential for a smooth player experience.
