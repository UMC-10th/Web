import { useState, useEffect, useRef } from 'react';

interface UseFetchResult<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
}

export function useCustomFetch<T>(
    url: string,
    params?: Record<string, string | number>,
): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    //params를 직렬화해서 의존성으로 쓰기 위함
    const paramString = params ? 
JSON.stringify(params) : "";
    //AbortController를 useRef로 관리하여 컴포넌트가 언마운트되거나 
    // url/params가 변경될 때 이전 요청을 취소할 수 있도록 함
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if(!url) return;

        //이전 요청이 있으면 취소
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        const fullUrl = params 
            ? `${url}?${new URLSearchParams(
                Object.entries(params).reduce(
                    (acc, [key, value]) => ({ ...acc, [key]: String(value) }),
                    {}
                )
            ).toString()}`
            : url;
            
        setIsLoading(true);
        setError(null);

        fetch(fullUrl, { signal: abortRef.current.signal })
            .then((res) => {
                if (!res.ok) throw new Error('HTTP error! status: ${res.status}');
                return res.json();
            })
            .then((json) => setData(json))

            .catch((err) => {
                if (
                    abortRef.current?.signal.aborted ||
                    err?.name === 'AbortError' ||
                    err?.message?.includes('aborted') //브라우저마다 다른 abort 에러 메시지 대응
                ) {
                    //취소된 요청의 에러는 무시
                    return;
                }

                setError(err?.message ?? "알 수 없는 에러가 발생했어요");
            })
            .finally(() => {
                if (!abortRef.current?.signal.aborted) {
                    setIsLoading(false);
                }
            }
                )

            
        return () => abortRef.current?.abort();
    }, [url, paramString]);

    return { data, isLoading, error };
}