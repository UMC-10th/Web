import { useState, useEffect, useRef } from "react";

/**
 * useThrottle(value, interval)
 *
 * value가 아무리 빠르게 바뀌어도 interval ms에 한 번만 최신값을 반환한다.
 *
 * 동작 원리:
 *  - 마지막으로 값을 반영한 시각을 lastFired ref에 기록한다.
 *  - value가 바뀔 때:
 *      - 남은 대기 시간이 없으면 즉시 반영한다.
 *      - 남은 대기 시간이 있으면 그 시간 뒤에 한 번만 반영하도록 타이머를 건다.
 *  - 컴포넌트 언마운트 또는 다음 effect 실행 전에 타이머를 clearTimeout으로 정리한다.
 */
export const useThrottle = <T>(value: T, interval: number = 1000): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastFired = useRef<number>(0);

  useEffect(() => {
    const now = Date.now();
    const remaining = interval - (now - lastFired.current);

    if (remaining <= 0) {
      // interval이 충분히 지났으면 즉시 반영
      lastFired.current = now;
      setThrottledValue(value);
    } else {
      // 아직 interval이 남아 있으면 남은 시간 뒤에 한 번만 반영
      const timer = setTimeout(() => {
        lastFired.current = Date.now();
        setThrottledValue(value);
      }, remaining);

      // value 변경 or 언마운트 시 예약된 타이머 취소
      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
};
