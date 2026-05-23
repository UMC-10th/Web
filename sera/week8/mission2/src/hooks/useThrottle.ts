import { useRef, useCallback } from "react";

// [week8/mission2] 새로 추가한 커스텀 훅
// fn을 interval(ms) 동안 최대 1번만 실행되도록 제한
// → 스크롤처럼 이벤트가 폭발적으로 발생할 때 과도한 호출을 방지
export function useThrottle<T extends unknown[]>(
  fn: (...args: T) => void,
  interval: number
): (...args: T) => void {
  // 마지막 실행 시각 기록 (렌더링과 무관하게 유지)
  const lastTime = useRef<number>(0);
  // 대기 중인 타이머 (trailing 호출용)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const throttled = useCallback(
    (...args: T) => {
      const now = Date.now();
      const remaining = interval - (now - lastTime.current);

      if (remaining <= 0) {
        // interval이 지났으면 즉시 실행
        if (timer.current) {
          clearTimeout(timer.current);
          timer.current = null;
        }
        lastTime.current = now;
        fn(...args);
      } else {
        // interval 아직 안 지났으면 남은 시간 후 trailing 실행
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          lastTime.current = Date.now();
          timer.current = null;
          fn(...args);
        }, remaining);
      }
    },
    [fn, interval]
  );

  return throttled;
}
