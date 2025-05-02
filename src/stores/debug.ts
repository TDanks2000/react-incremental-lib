import { StateCreator, StoreMutatorIdentifier } from 'zustand';

/**
 * Debug middleware options for store monitoring
 */
export interface DebugMiddlewareOptions {
  /** Enable or disable the middleware */
  enabled?: boolean;
  /** Log level for console output */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  /** Prefix for log messages */
  logPrefix?: string;
  /** Filter function to determine which actions to log */
  filter?: (action: string) => boolean;
  /** Performance threshold in ms to trigger warnings */
  performanceThreshold?: number;
  /** Enable action history tracking */
  trackHistory?: boolean;
  /** Maximum number of actions to keep in history */
  historyLimit?: number;
}

/**
 * Action history entry for debugging
 */
export interface ActionHistoryEntry {
  timestamp: number;
  action: string;
  prevState: unknown;
  nextState: unknown;
  duration: number;
}

// Global action history for debugging
const actionHistory: ActionHistoryEntry[] = [];

/**
 * Get the current action history
 */
export const getActionHistory = () => [...actionHistory];

/**
 * Clear the action history
 */
export const clearActionHistory = () => {
  actionHistory.length = 0;
};

/**
 * Debug middleware that combines logging, performance monitoring, and history tracking
 */
export const debug = <
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  config: StateCreator<T, Mps, Mcs>,
  options: DebugMiddlewareOptions = {},
): StateCreator<T, Mps, Mcs> => {
  const {
    enabled = true,
    logLevel = 'debug',
    logPrefix = 'store',
    filter = () => true,
    performanceThreshold = 5,
    trackHistory = false,
    historyLimit = 100,
  } = options;

  return (set, get, api) => {
    type S = ReturnType<typeof config>;

    const wrappedSet = ((
      ...args: [Partial<S> | ((state: S) => Partial<S>), boolean?]
    ) => {
      if (!enabled) {
        set(...args);
        return;
      }

      // Extract action name for logging
      let actionName = 'unknown';
      const firstArg = args[0];
      if (typeof firstArg === 'function') {
        actionName = firstArg.name || 'anonymous';
      } else if (firstArg && typeof firstArg === 'object') {
        const changedKeys = Object.keys(firstArg).join(', ');
        actionName = changedKeys || 'state update';
      }

      // Skip if filtered out
      if (!filter(actionName)) {
        set(...args);
        return;
      }

      const prevState = get();
      const startTime = window.performance.now();

      set(...args);

      const endTime = window.performance.now();
      const duration = endTime - startTime;
      const nextState = get();

      // Track history if enabled
      if (trackHistory) {
        actionHistory.unshift({
          timestamp: Date.now(),
          action: actionName,
          prevState,
          nextState,
          duration,
        });

        // Limit history size
        if (actionHistory.length > historyLimit) {
          actionHistory.pop();
        }
      }

      // Log based on configured level
      const groupName = `${logPrefix}: ${actionName} (${duration.toFixed(2)}ms)`;

      // Performance warning
      if (duration > performanceThreshold) {
        console.warn(`⚠️ ${groupName} - Performance threshold exceeded`);
      }

      if (logLevel === 'debug') {
        console.group(groupName);
        console.debug('prev state:', prevState);
        console.debug('next state:', nextState);
        console.debug('changed:', firstArg);
        console.groupEnd();
      } else if (logLevel === 'info') {
        console.info(groupName, {
          prev: prevState,
          next: nextState,
          changed: firstArg,
        });
      } else if (logLevel === 'warn') {
        console.warn(groupName, {
          prev: prevState,
          next: nextState,
          changed: firstArg,
        });
      } else if (logLevel === 'error') {
        console.error(groupName, {
          prev: prevState,
          next: nextState,
          changed: firstArg,
        });
      }
    }) as typeof set;

    return config(wrappedSet, get, api);
  };
};

/**
 * Create a middleware configuration with debug options
 */
export const createDebugMiddleware = <T extends object>(
  options: DebugMiddlewareOptions = {},
) => {
  return (config: StateCreator<T>) => debug(config, options);
};
