import { useState, useEffect } from "react";

/**
 * [요구사항 1] useDebounce 커스텀 훅
 * value가 delay ms 동안 변경되지 않으면 최종값을 반환한다.
 * value 또는 delay가 바뀌거나 컴포넌트가 언마운트될 때 이전 타이머를 정리한다.
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay ms 뒤에 최신값을 반영
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // value·delay 변경 or 언마운트 → 기존 타이머 제거(debounce 핵심)
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
