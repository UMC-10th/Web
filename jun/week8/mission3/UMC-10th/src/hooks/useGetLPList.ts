import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../apis/lp";

export const useGetLPList = (
  sort: "asc" | "desc" = "desc",
  search?: string          // ← 추가
) => {
  return useInfiniteQuery({
    queryKey: ["lps", sort, search],   // ← search 추가
    queryFn: ({ pageParam }) =>
      getLpList(
        sort,
        pageParam === 0 ? undefined : (pageParam as number),
        10,
        search || undefined              // ← 추가
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
  return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
},
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,  // ← 이거 추가
  });
};