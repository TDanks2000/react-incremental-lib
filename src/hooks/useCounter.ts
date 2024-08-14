import useCurrencyStore from '../stores/currency';

export const useCounter = () => {
  const { currency, increase, decrease } = useCurrencyStore();

  return {
    currency,
    increase,
    decrease,
  };
};
