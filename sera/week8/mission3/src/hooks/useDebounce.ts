import { useState, useEffect } from "react";

// [week8/mission1] 새로 추가한 커스텀 훅
// value가 바뀔 때마다 즉시 반영하지 않고, delay(ms)만큼 기다린 후 반영
// → 검색창처럼 연속 입력이 있을 때 마지막 입력 후에만 동작하도록 지연
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 후에 값 업데이트
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // value나 delay가 바뀌면 이전 타이머 취소 → 마지막 입력만 처리됨
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
