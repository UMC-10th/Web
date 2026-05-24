import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value:T, delay = 500) {
    
    // 1. 상태 변수: Throttled value -> 최종적으로 thorttling 적용된 value 찾아
    const [throttledValue, setThrottledValue] = useState(value);

    // 2. Ref lastExecuted: 마지막으로 실행된 시간을 기록하는 변수
    // useRef 사용하면 component rerendering 되어도 값이 유지되고, 값이 변경되어도 rerendering을 trigger하지 않음
    const lastExecuted = useRef<number>(Date.now());

    //3. useEffect 이용해 value, delay 바뀔 때 마다 실행

    useEffect(() => {
        // 현재 시각과 lastExecuted.current에 저장된 마지막 시각 + delay를 비교
        // 충분한 시간이 지났다면 update : throtting
        if (Date.now() >= lastExecuted.current + delay) {
            // 현재 시간이 지난 경우 -> 현재 시각으로 lastExecuted 업데이트
            lastExecuted.current = Date.now();
            //최신 value를 thorttledValue에 저장해서 component rerendering
            setThrottledValue(value);
        } 
        // 충분한 시간이 지나지 않았다면 delay 시간 이후에 최신 value로 업데이트
        else {
            const timerId = setTimeout(() => {
                //timer가 만료되면 마지막 업데이트 시간을 현재 시각으로 갱신
                lastExecuted.current = Date.now();
                setThrottledValue(value);
            }, delay);

            // CleanUp 재실행 되기전 타이머가 실행되지 않았다면 기존 타이머를 취소해 중복 업데이트 방지
            return () => clearTimeout(timerId);
        }
    }, [value, delay]);

    return throttledValue;
}

export default useThrottle;