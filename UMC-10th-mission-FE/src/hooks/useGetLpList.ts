import { useInfiniteQuery } from "@tanstack/react-query";
import { getLps } from "../apis/lp";

export const useGetLpList = (sort: "latest" | "oldest" = "latest") => {
  return useInfiniteQuery({
    queryKey: ["lps", sort], // 정렬 기준이 바뀌면 새로 캐싱
    queryFn: ({ pageParam = 0 }) => getLps(sort, pageParam), // pageParam이 바로 cursor 역할!
    initialPageParam: 0, // 첫 시작 커서는 0번
    getNextPageParam: (lastPage) => {
      // 💡 서버에서 "다음 데이터 있어!(hasNext)"라고 하면 다음 커서 번호를 주고, 없으면 undefined!
      return lastPage.data.hasNext ? (lastPage.data.cursor ?? undefined) : undefined;
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};