import { useEffect, useRef, useState } from "react";
import axios, { type AxiosRequestConfig } from "axios";

function shortErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401) return "401 UNAUTHORIZED";
        if (status === 404) return "404 NOT FOUND";
        if (status != null && status >= 500) return `${status} SERVER ERROR`;
        if (err.code === "ERR_NETWORK") return "NETWORK ERROR";
        if (status != null) return `${status} ERROR`;
    }
    return "UNKNOWN ERROR";
}


export function useCustomFetch<T>(
    url: string | null,
    requestConfig?: AxiosRequestConfig,
): {
    data: T | null;
    loading: boolean;
    error: string | null;
} {
    const configRef = useRef(requestConfig);
    configRef.current = requestConfig;

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(() => Boolean(url));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!url) {
            setData(null);
            setError(null);
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        setLoading(true);
        setError(null);

        axios
            .get<T>(url, {
                ...configRef.current,
                signal: controller.signal,
            })
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                if (controller.signal.aborted) return;
                setData(null);
                setError(shortErrorMessage(err));
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [url]);

    return { data, loading, error };
}
