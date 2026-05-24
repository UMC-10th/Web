import { useEffect, useState } from "react";

function useDebounce<T>(value:T, delay:number) {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    // value, delay 바뀔 때 마다 실행
    useEffect(() => {
        // 행동을 멈추고 delay(ms) 후에 값 갱신(value => debouncedValue) 이 실행됨
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        // value가 변경되면, 기존 타이머를 지운 뒤 업데이트를 취소 (clean up)
        // 값이 계속 바뀔 때 마다 마지막에 멈춘 값만 업뎃
        return () => clearTimeout(handler);
    }, [value, delay]);

    // 최종적으로 "잠시 대기 후"의 값을 return
    return debouncedValue;
}

export default useDebounce;