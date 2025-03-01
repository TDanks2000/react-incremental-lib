import { useEffect, useState } from 'react';

interface UseIdleProgressProps {
  resourcePerSecond: number;
}

export const useIdleProgress = ({
  resourcePerSecond,
}: UseIdleProgressProps) => {
  const [lastTime, setLastTime] = useState<number>(() => Date.now());
  const [idleGain, setIdleGain] = useState(0);

  useEffect(() => {
    const storedTime = localStorage.getItem('lastSession');
    if (storedTime) {
      const elapsedSeconds = (Date.now() - Number(storedTime)) / 1000;
      setIdleGain(elapsedSeconds * resourcePerSecond);
    }
    setLastTime(Date.now());
  }, []);

  useEffect(() => {
    localStorage.setItem('lastSession', String(lastTime));
  }, [lastTime]);

  return { idleGain };
};
