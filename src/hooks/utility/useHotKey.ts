import { useEffect, useRef, useCallback } from 'react';
import { UseHotKeyProps } from '../../types/ui/hotkey.types';

export const useHotKey = ({
  keys,
  callback,
  eventType = 'keydown',
  preventDefault = false,
  stopPropagation = false,
  disabled = false,
  debounceMs = 0,
  requireExactOrder = false,
  allowRepeat = true
}: UseHotKeyProps) => {
  const pressedKeys = useRef(new Set<string>());
  const keySequence = useRef<string[]>([]);
  const lastCallTime = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const isModifierKey = (key: string): boolean => {
    const modifiers = ['control', 'alt', 'shift', 'meta'];
    return modifiers.includes(key.toLowerCase());
  };

  const handleCallback = useCallback((event: KeyboardEvent) => {
    const now = Date.now();
    if (debounceMs > 0 && now - lastCallTime.current < debounceMs) return;
    if (!allowRepeat && event.repeat) return;

    if (preventDefault) event.preventDefault();
    if (stopPropagation) event.stopPropagation();

    callback(event);
    lastCallTime.current = now;
  }, [callback, debounceMs, preventDefault, stopPropagation, allowRepeat]);

  useEffect(() => {
    if (disabled) return;

    const keysArray = Array.isArray(keys) ? keys : [keys];
    const normalizedKeys = keysArray.map(k => k.toLowerCase());

    const checkKeys = (): boolean => {
      if (requireExactOrder) {
        const sequence = keySequence.current;
        return normalizedKeys.every((k, i) => sequence[sequence.length - normalizedKeys.length + i] === k);
      }
      return normalizedKeys.every(k => pressedKeys.current.has(k));
    };

    const handleKeyEvent = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      if (event.type === 'keydown') {
        pressedKeys.current.add(key);
        keySequence.current.push(key);

        // Limit sequence length to prevent memory leaks
        if (keySequence.current.length > normalizedKeys.length * 2) {
          keySequence.current = keySequence.current.slice(-normalizedKeys.length);
        }

        if (checkKeys()) {
          handleCallback(event);
        }
      } else if (event.type === 'keyup') {
        pressedKeys.current.delete(key);
        if (!isModifierKey(key)) {
          keySequence.current = [];
        }
      }
    };

    document.addEventListener(eventType, handleKeyEvent);
    document.addEventListener('keyup', handleKeyEvent);

    return () => {
      document.removeEventListener(eventType, handleKeyEvent);
      document.removeEventListener('keyup', handleKeyEvent);
      pressedKeys.current.clear();
      keySequence.current = [];
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [keys, handleCallback, eventType, disabled, requireExactOrder]);

  return null;
};
