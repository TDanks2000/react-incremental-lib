import { Notation } from '../../types';

export const useNotation = (
  number: string | number,
  notation: Notation,
  locale: string = 'en-US',
) => {
  const numberValue = typeof number === 'string' ? Number(number) : number;
  if (isNaN(numberValue)) return number;
  return new Intl.NumberFormat(locale, { notation }).format(numberValue);
};
