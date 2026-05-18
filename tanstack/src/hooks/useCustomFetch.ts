import { useQuery } from "@tanstack/react-query";

export const useCustomFetch = <T>(url: string) => {
  return useQuery({
    queryKey: [url],

    queryFn: async ({ signal }) => {
      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      return response.json() as Promise<T>;
    },

    retry: 3,

    // 지수 백오프 전략
    retryDelay: (attemptIndex) =>
      Math.min(1000 * Math.pow(2, attemptIndex), 30000),

    staleTime: 5 * 60 * 1000,

    // 가비지 컬렉션 시간
    gcTime: 10 * 60 * 1000,
  });
};
