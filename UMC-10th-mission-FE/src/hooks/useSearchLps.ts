import { useInfiniteQuery } from "@tanstack/react-query";
import { searchLps } from "../apis/lp";

/**
 * [요구사항 3] 검색어 기반 무한 스크롤 훅
 * - queryKey에 debouncedQuery를 포함 → 검색어가 달라지면 독립 캐시 슬롯 사용
 * - enabled: 공백·빈 문자열일 때 쿼리 실행 자체를 차단
 * - staleTime(1분): 같은 검색어를 짧은 시간 안에 다시 치면 캐시를 재사용해 요청 절약
 * - gcTime(5분): 다른 검색어로 이동 후에도 5분간 캐시 유지 → 뒤로가기 시 즉시 복원
 */
export const useSearchLps = (debouncedQuery: string) => {
  // 빈 문자열·공백만 입력된 경우 API 요청 차단 조건
  const isValidQuery = debouncedQuery.trim().length > 0;

  return useInfiniteQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: ({ pageParam = 0 }) => searchLps(debouncedQuery, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // hasNext=false면 undefined를 반환해 fetchNextPage 호출을 막는다
      return lastPage.data.hasNext ? (lastPage.data.cursor ?? undefined) : undefined;
    },
    enabled: isValidQuery,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};
