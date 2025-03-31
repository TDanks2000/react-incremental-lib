export interface CurrencyState {
  currency: number;
  currencyName?: string;
}

export interface UseResourceCapProps {
  cap: number;
  onCapReached?: () => void;
}

export interface UseMultiplierProps {
  multiplier: number;
  onMultiplierChange?: (newMultiplier: number) => void;
}