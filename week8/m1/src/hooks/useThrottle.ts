import { useCallback, useRef } from "react";

export function useThrottle<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
) {
    const lastRunTime = useRef(0);
    const timerRef = useRef<number | null>(null);

    return useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();
            const remainingTime = delay - (now - lastRunTime.current);

            if (remainingTime <= 0) {
                if (timerRef.current) {
                    window.clearTimeout(timerRef.current);
                    timerRef.current = null;
                }

                lastRunTime.current = now;
                callback(...args);
                return;
            }

            if (!timerRef.current) {
                timerRef.current = window.setTimeout(() => {
                    lastRunTime.current = Date.now();
                    timerRef.current = null;
                    callback(...args);
                }, remainingTime);
            }
        },
        [callback, delay]
    );
}
