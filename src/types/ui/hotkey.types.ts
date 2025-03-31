export type HotKeyType = 'keydown' | 'keyup';

export type KeyCombination = string[];

export interface UseHotKeyProps {
  /** Single key or combination of keys that trigger the callback */
  keys: string | KeyCombination;
  /** Function to call when the hotkey is triggered */
  callback: (event: KeyboardEvent) => void;
  /** Type of keyboard event to listen for */
  eventType?: HotKeyType;
  /** Whether to prevent the default browser behavior */
  preventDefault?: boolean;
  /** Whether to stop the event propagation */
  stopPropagation?: boolean;
  /** Whether the hotkey is currently disabled */
  disabled?: boolean;
  /** Minimum time (in ms) between callback executions */
  debounceMs?: number;
  /** Whether keys must be pressed in the exact order specified */
  requireExactOrder?: boolean;
  /** Whether to allow key repeat events */
  allowRepeat?: boolean;
}