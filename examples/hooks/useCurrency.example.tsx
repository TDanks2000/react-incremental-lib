import React from 'react';
import { useCurrency } from 'react-incremental-lib';

export const UseCurrencyExample = () => {
  const { currency, increase, decrease, currencyName, reset, setCurrencyName } =
    useCurrency();

  return (
    <div>
      <h1>Currency: {currency}</h1>
      <h2>Currency Name: {currencyName || 'Not Set'}</h2>

      <button onClick={() => increase(10)}>Increase +10</button>
      <button onClick={() => decrease(5)}>Decrease -5</button>
      <button onClick={reset}>Reset</button>
      <button onClick={() => setCurrencyName('Gold')}>Set Name to Gold</button>
    </div>
  );
};
