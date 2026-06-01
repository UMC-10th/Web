import { useEffect, useRef, useState } from 'react';

export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(0);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const elapsedTime = Date.now() - lastExecuted.current;

    if (elapsedTime >= interval) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
      return;
    }

    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    timerId.current = setTimeout(() => {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
      timerId.current = null;
    }, interval - elapsedTime);

    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = null;
      }
    };
  }, [value, interval]);

  return throttledValue;
}
