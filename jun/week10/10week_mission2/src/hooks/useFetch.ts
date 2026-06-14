// useFetch.tsx 파일 (수정할 내용 없음)

import type { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import {axiosClient} from "../apis/axiosClient"; // 경로 확인 필요

const useFetch = <T>(url: string, options?: AxiosRequestConfig): { data: T | null, error: string | null, isLoading: boolean } => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const {data} = await axiosClient.get(url, { ...options, });
        setData(data);
      } catch (e) {
        setError("데이터를 가져오는데 에러가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // 💡 의존성 배열에 'url'과 'options'이 있기 때문에, 이 둘 중 하나만 바뀌어도 API를 재호출합니다.
  }, [url, options]);

  return {
    data,
    error,
    isLoading,
  };
};

export default useFetch;
