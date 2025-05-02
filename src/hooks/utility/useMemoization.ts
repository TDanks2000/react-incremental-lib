import { useCallback, useMemo, useRef } from 'react';
import { memoizeWithPerformance } from '../../utils/performance';

/**
 * Options for the useMemoization hook
 */
export interface UseMemoizationOptions {
  /** Maximum cache size */
  maxSize?: number;
  /** Name for performance tracking */
  name?: string;
  /** Whether to track performance */
  trackPerformance?: boolean;
  /** Custom key generation function */
  keyFn?: (...args: any[]) => string;
}

/**
 * Hook for memoizing expensive functions with performance tracking
 *
 * @example
 * ```tsx
 * const { memoize, stats, clearCache } = useMemoization();
 *
 * // Create a memoized version of an expensive calculation
 * const calculateExpensiveValue = memoize(
 *   (input: number) => {
 *     // Expensive operation
 *     return someComplexCalculation(input);
 *   },
 *   { name: 'expensiveCalculation' }
 * );
 *
 * // Use the memoized function
 * const result = calculateExpensiveValue(inputValue);
 *
 * // Check cache performance
 * console.log(stats);
 * ```
 */
export const useMemoization = (options: UseMemoizationOptions = {}) => {
  const {
    maxSize = 100,
    name = 'memoized',
    trackPerformance = true,
    keyFn,
  } = options;

  // Store memoized functions to prevent recreation on each render
  const memoizedFunctionsRef = useRef<Map<Function, Function>>(new Map());

  // Stats for all memoized functions
  const statsRef = useRef({
    hits: 0,
    misses: 0,
    total: 0,
  });

  // Create a memoized version of a function
  const memoize = useCallback(
    <T extends (...args: any[]) => any>(
      fn: T,
      fnOptions: Partial<UseMemoizationOptions> = {},
    ): T => {
      // Check if we already memoized this function
      if (memoizedFunctionsRef.current.has(fn)) {
        return memoizedFunctionsRef.current.get(fn) as T;
      }

      // Create memoized version with performance tracking
      const memoized = memoizeWithPerformance(fn, {
        name: fnOptions.name || `${name}_${fn.name || 'anonymous'}`,
        maxSize: fnOptions.maxSize || maxSize,
        keyFn: fnOptions.keyFn || keyFn,
      });

      // Store for future reference
      memoizedFunctionsRef.current.set(fn, memoized);

      return memoized;
    },
    [name, maxSize, keyFn],
  );

  // Clear all caches
  const clearAllCaches = useCallback(() => {
    memoizedFunctionsRef.current.forEach((memoizedFn: any) => {
      if (typeof memoizedFn.clearCache === 'function') {
        memoizedFn.clearCache();
      }
    });

    statsRef.current = {
      hits: 0,
      misses: 0,
      total: 0,
    };
  }, []);

  // Aggregate stats from all memoized functions
  const getStats = useCallback(() => {
    const aggregatedStats = {
      hits: 0,
      misses: 0,
      total: 0,
      functionCount: memoizedFunctionsRef.current.size,
      functions: {} as Record<string, any>,
    };

    memoizedFunctionsRef.current.forEach((memoizedFn: any, originalFn) => {
      if (memoizedFn.stats) {
        const fnStats = memoizedFn.stats;
        aggregatedStats.hits += fnStats.hits;
        aggregatedStats.misses += fnStats.misses;
        aggregatedStats.total += fnStats.total;

        const fnName = originalFn.name || 'anonymous';
        aggregatedStats.functions[fnName] = fnStats;
      }
    });

    return aggregatedStats;
  }, []);

  // Return stable API
  return useMemo(
    () => ({
      memoize,
      clearCache: clearAllCaches,
      getStats,
      get stats() {
        return getStats();
      },
    }),
    [memoize, clearAllCaches, getStats],
  );
};
