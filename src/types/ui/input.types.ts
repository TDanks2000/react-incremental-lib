export type Notation = 'compact' | 'standard' | 'scientific' | 'engineering';

export type LetterKey =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

export type DigitKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type HotKeyName =
  | LetterKey
  | DigitKey
  | 'shift'
  | 'ctrl'
  | 'alt'
  | 'meta'
  | 'space'
  | 'enter'
  | 'tab'
  | 'escape'
  | 'backspace'
  | 'delete'
  | 'arrowup'
  | 'arrowdown'
  | 'arrowleft'
  | 'arrowright'
  | 'home'
  | 'end'
  | 'pageup'
  | 'pagedown';

export type HotKeyInput = HotKeyName | Array<HotKeyName>;

export interface UseHotKeyOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  capture?: boolean;
  enabled?: boolean;
}