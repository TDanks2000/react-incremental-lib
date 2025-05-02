/**
 * Performance utilities for React Incremental Library
 */

/**
 * Options for performance measurement
 */
export interface PerformanceMeasureOptions {
  /** Name of the measurement */
  name: string;
  /** Whether to log the result automatically */
  autoLog?: boolean;
  /** Threshold in ms to trigger warnings */
  warnThreshold?: number;
  /** Custom logger function */
  logger?: (name: string, duration: number) => void;
}

/**
 * Performance measurement result
 */
export interface PerformanceMeasureResult {
  /** Name of the measurement */
  name: string;
  /** Duration in milliseconds */
  duration: number;
  /** Start timestamp */
  startTime: number;
  /** End timestamp */
  endTime: number;
}

// Store for recent measurements
const recentMeasurements: PerformanceMeasureResult[] = [];
const measurementLimit = 100;

/**
 * Start a performance measurement
 * @param name Identifier for the measurement
 * @returns A function to end the measurement
 */
export const startMeasure = (name: string) => {
  const startTime = performance.now();

  return (options: Partial<PerformanceMeasureOptions> = {}) => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    const result: PerformanceMeasureResult = {
      name,
      duration,
      startTime,
      endTime,
    };

    // Add to recent measurements
    recentMeasurements.unshift(result);
    if (recentMeasurements.length > measurementLimit) {
      recentMeasurements.pop();
    }

    // Auto log if enabled
    if (options.autoLog) {
      const warnThreshold = options.warnThreshold ?? 16.67; // Default to 60fps threshold

      if (duration > warnThreshold) {
        console.warn(
          `⚠️ Performance: ${name} took ${duration.toFixed(2)}ms (threshold: ${warnThreshold}ms)`,
        );
      } else {
        console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
      }
    }

    // Use custom logger if provided
    if (options.logger) {
      options.logger(name, duration);
    }

    return result;
  };
};

/**
 * Measure the performance of a function
 * @param fn Function to measure
 * @param options Measurement options
 * @returns The result of the function
 */
export const measureFunction = <T>(
  fn: () => T,
  options: PerformanceMeasureOptions,
): T => {
  const start = startMeasure(options.name);
  const result = fn();
  start(options);
  return result;
};

/**
 * Create a memoized version of a function with performance tracking
 * @param fn Function to memoize
 * @param keyFn Optional function to generate cache key
 * @returns Memoized function
 */
export const memoizeWithPerformance = <T extends (...args: any[]) => any>(
  fn: T,
  options: {
    name?: string;
    maxSize?: number;
    keyFn?: (...args: Parameters<T>) => string;
  } = {},
): T => {
  const {
    name = fn.name || 'anonymous',
    maxSize = 100,
    keyFn = (...args) => JSON.stringify(args),
  } = options;

  const cache = new Map<string, ReturnType<T>>();
  const stats = {
    hits: 0,
    misses: 0,
    total: 0,
  };

  const memoized = ((...args: Parameters<T>): ReturnType<T> => {
    stats.total++;
    const key = keyFn(...args);

    if (cache.has(key)) {
      stats.hits++;
      return cache.get(key)!;
    }

    stats.misses++;
    const start = startMeasure(`${name} (cache miss)`);
    const result = fn(...args);
    start({ autoLog: true, warnThreshold: 5 });

    // Manage cache size
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      if (!firstKey) {
        throw new Error('Cache is empty');
      }
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  }) as T;

  // Add stats to the function for inspection
  Object.defineProperty(memoized, 'stats', {
    get: () => ({ ...stats, cacheSize: cache.size }),
  });

  Object.defineProperty(memoized, 'clearCache', {
    value: () => {
      cache.clear();
      stats.hits = 0;
      stats.misses = 0;
      stats.total = 0;
    },
  });

  return memoized;
};

/**
 * Get recent performance measurements
 * @returns Array of recent measurements
 */
export const getRecentMeasurements = () => [...recentMeasurements];

/**
 * Clear all stored measurements
 */
export const clearMeasurements = () => {
  recentMeasurements.length = 0;
};

/**
 * Benchmark a function with multiple iterations
 * @param fn Function to benchmark
 * @param iterations Number of iterations to run
 * @param options Benchmark options
 * @returns Benchmark results
 */
export const benchmark = <T>(
  fn: () => T,
  iterations: number = 100,
  options: {
    name?: string;
    warmupRuns?: number;
    logResults?: boolean;
  } = {},
) => {
  const {
    name = fn.name || 'anonymous',
    warmupRuns = 3,
    logResults = true,
  } = options;

  // Warm up
  for (let i = 0; i < warmupRuns; i++) {
    fn();
  }

  const durations: number[] = [];
  const startTotal = performance.now();

  // Run benchmark
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    durations.push(end - start);
  }

  const endTotal = performance.now();
  const totalDuration = endTotal - startTotal;

  // Calculate statistics
  durations.sort((a, b) => a - b);
  const min = durations[0];
  const max = durations[durations.length - 1];
  const sum = durations.reduce((a, b) => a + b, 0);
  const avg = sum / durations.length;
  const median = durations[Math.floor(durations.length / 2)];

  // Calculate percentiles
  const p95 = durations[Math.floor(durations.length * 0.95)];
  const p99 = durations[Math.floor(durations.length * 0.99)];

  const results = {
    name,
    iterations,
    totalDuration,
    averageDuration: avg,
    medianDuration: median,
    minDuration: min,
    maxDuration: max,
    p95Duration: p95,
    p99Duration: p99,
    opsPerSecond: 1000 / avg,
  };

  if (logResults) {
    console.group(`Benchmark: ${name}`);
    console.log(`Iterations: ${iterations}`);
    console.log(`Total time: ${totalDuration.toFixed(2)}ms`);
    console.log(`Operations/sec: ${results.opsPerSecond.toFixed(2)}`);
    console.log(`Average: ${avg.toFixed(3)}ms`);
    console.log(`Median: ${median.toFixed(3)}ms`);
    console.log(`Min: ${min.toFixed(3)}ms`);
    console.log(`Max: ${max.toFixed(3)}ms`);
    console.log(`95th percentile: ${p95.toFixed(3)}ms`);
    console.log(`99th percentile: ${p99.toFixed(3)}ms`);
    console.groupEnd();
  }

  return results;
};
