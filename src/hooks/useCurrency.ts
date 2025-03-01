import { useCurrencyStore } from '../stores';

export const useCurrency = () => {
  const { currency, increase, decrease, currencyName, reset, setCurrencyName } =
    useCurrencyStore();

  return {
    currency,
    increase,
    decrease,
    currencyName,
    reset,
    setCurrencyName,
  };
};
