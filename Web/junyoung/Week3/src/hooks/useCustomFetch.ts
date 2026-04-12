import { useState, useEffect } from 'react';
import axios from 'axios';

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

function useCustomFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.get<T>(url, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        setData(data);
      } catch {
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (url) fetchData();
  }, [url]);

  return { data, isLoading, error };
}

export default useCustomFetch;
