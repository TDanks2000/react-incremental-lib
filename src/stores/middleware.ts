import { StateCreator, StoreMutatorIdentifier } from 'zustand';

// Define middleware types
export type LoggerMiddleware = <
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string,
) => StateCreator<T, Mps, Mcs>;

export type MiddlewareOptions = {
  enabled?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  logPrefix?: string;
  filter?: (action: string) => boolean;
};

// Logger middleware implementation
export const logger = <
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  config: StateCreator<T, Mps, Mcs>,
  options: MiddlewareOptions = {},
): StateCreator<T, Mps, Mcs> => {
  const {
    enabled = true,
    logLevel = 'debug',
    logPrefix = 'store update',
    filter = () => true,
  } = options;

  return (set, get, api) => {
    type S = ReturnType<typeof config>;

    // Explicitly define the tuple for the arguments based on Zustand's set function signature.
    const wrappedSet = ((
      ...args: [Partial<S> | ((state: S) => Partial<S>), boolean?]
    ) => {
      if (!enabled) {
        set(...args);
        return;
      }

      const prevState = get();
      set(...args);
      const nextState = get();

      let actionName = 'unknown';
      const firstArg = args[0];
      if (typeof firstArg === 'function') {
        actionName = firstArg.name || 'anonymous';
      } else if (firstArg && typeof firstArg === 'object') {
        const changedKeys = Object.keys(firstArg).join(', ');
        actionName = changedKeys || 'state update';
      }

      if (!filter(actionName)) {
        return;
      }

      const groupName = `${logPrefix}: ${actionName}`;

      if (logLevel === 'debug') {
        console.group(groupName);
        console.debug('prev state:', prevState);
        console.debug('next state:', nextState);
        console.debug('changed state:', firstArg);
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

// Performance monitoring middleware
export const performance = <
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  config: StateCreator<T, Mps, Mcs>,
  options: MiddlewareOptions = {},
): StateCreator<T, Mps, Mcs> => {
  const { enabled = true, logPrefix = 'performance' } = options;

  return (set, get, api) => {
    type S = ReturnType<typeof config>;

    const wrappedSet = ((
      ...args: [Partial<S> | ((state: S) => Partial<S>), boolean?]
    ) => {
      if (!enabled) {
        set(...args);
        return;
      }

      const startTime = window.performance.now();
      set(...args);
      const endTime = window.performance.now();
      const duration = endTime - startTime;

      if (duration > 5) {
        console.warn(
          `${logPrefix}: State update took ${duration.toFixed(2)}ms`,
        );
      }
    }) as typeof set;

    return config(wrappedSet, get, api);
  };
};

// Create a middleware factory that combines multiple middlewares
export const createMiddleware = <T extends object>(
  options: {
    logger?: MiddlewareOptions;
    performance?: MiddlewareOptions;
  } = {},
) => {
  return (config: StateCreator<T>) => {
    let enhancedConfig = config;

    if (options.performance) {
      enhancedConfig = performance(enhancedConfig, options.performance);
    }

    if (options.logger) {
      enhancedConfig = logger(enhancedConfig, options.logger);
    }

    return enhancedConfig;
  };
};
