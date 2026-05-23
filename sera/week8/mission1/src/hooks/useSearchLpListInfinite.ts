import { useInfiniteQuery } from "@tanstack/react-query";
import { searchLps } from "../apis/lp";

// [week8/mission1] 새로 추가한 훅 - 검색어 기반 무한스크롤
// useGetLpListInfinite와 분리해서 검색 모드일 때만 사용
export const useSearchLpListInfinite = (
  query: string,
  sort: "latest" | "oldest" = "latest"
) => {
  const trimmed = query.trim();

  return useInfiniteQuery({
    // queryKey에 검색어 포함 → 검색어 바뀔 때마다 새로운 캐시로 관리
    queryKey: ["search", trimmed, sort],
    queryFn: ({ pageParam }) =>
      searchLps({ cursor: pageParam, query: trimmed, sort }),
    initialPageParam: undefined as number | undefined,
    // cursor 기반 페이지네이션: 다음 페이지가 없으면 undefined 반환
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? (lastPage.data.cursor ?? undefined) : undefined,
    // 빈 문자열이면 API 요청 자체를 막음 (enabled: false)
    enabled: trimmed.length > 0,
    staleTime: 1000 * 30,      // 30초간 fresh 유지
    gcTime: 1000 * 60 * 3,    // 3분 후 캐시 삭제
  });
};
