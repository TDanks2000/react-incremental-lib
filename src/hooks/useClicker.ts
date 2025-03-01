import { useState } from 'react';

interface UseClickerProps {
  initialValue?: number;
  onClick?: (newValue: number) => void;
}

export const useClicker = ({ initialValue = 0, onClick }: UseClickerProps) => {
  const [count, setCount] = useState(initialValue);

  const handleClick = () => {
    const newValue = count + 1;
    setCount(newValue);
    if (onClick) onClick(newValue);
  };

  return { count, handleClick };
};
