import React from 'react';
import { useNotation } from 'react-incremental-library';

export const UseNotationExample = () => {
  const formattedNumber = useNotation(123456789, 'compact', 'en-US');

  return (
    <div>
      <h1>Formatted Number</h1>
      <p>Original: 123456789</p>
      <p>Formatted: {formattedNumber}</p>
    </div>
  );
};
