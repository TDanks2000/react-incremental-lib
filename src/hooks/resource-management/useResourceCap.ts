import { useState } from 'react';

interface UseResourceCapProps {
  initialValue: number;
  max: number;
}

export const useResourceCap = ({ initialValue, max }: UseResourceCapProps) => {
  const [resource, setResource] = useState(initialValue);

  const addResource = (amount: number) => {
    setResource((prev) => Math.min(prev + amount, max));
  };

  const removeResource = (amount: number) => {
    setResource((prev) => Math.max(prev - amount, 0));
  };

  return { resource, addResource, removeResource };
};
