import { useCurrencyStore } from '../../stores';

interface UseCurrencyOptions {
  /**
   * Custom formatter for currency display
   * @param value The currency value to format
   * @returns Formatted string representation of the currency
   */
  formatter?: (value: number) => string;
  /**
   * Number of decimal places to display
   * @default 2
   */
  precision?: number;
  /**
   * Initial currency name
   */
  initialName?: string;
}

/**
 * Hook for managing game currency with formatting options
 * @param options Configuration options for the currency
 * @returns Currency state and methods
 */
export const useCurrency = (options?: UseCurrencyOptions) => {
  const {
    currency,
    increase,
    decrease,
    currencyName,
    reset,
    setCurrencyName,
    setPrecision,
    setFormat,
    getFormatted,
    getValue,
    setMaxValue,
    setMinValue,
  } = useCurrencyStore();

  // Apply options if provided
  if (options) {
    if (options.formatter) setFormat(options.formatter);
    if (options.precision !== undefined) setPrecision(options.precision);
    if (options.initialName) setCurrencyName(options.initialName);
  }

  return {
    currency,
    increase,
    decrease,
    currencyName,
    reset,
    setCurrencyName,
    setPrecision,
    setFormat,
    getFormatted,
    getValue,
    setMaxValue,
    setMinValue,
  };
};
