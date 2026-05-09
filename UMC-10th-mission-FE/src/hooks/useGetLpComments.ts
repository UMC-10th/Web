// src/hooks/useGetLpComments.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../apis/lp";

export const useGetLpComments = (lpId: string | undefined, order: "latest" | "oldest") => {
  return useInfiniteQuery({
    // 💡 [체크리스트 달성] queryKey에 lpId와 order 포함! (정렬 바뀌면 알아서 리패치)
    queryKey: ['lpComments', lpId, order],
    queryFn: ({ pageParam = 0 }) => getLpComments(Number(lpId), order, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // 서버에서 다음 댓글이 있다고 하면 다음 커서를 반환!
      return lastPage?.data?.hasNext ? lastPage.data.cursor : undefined;
    },
    enabled: !!lpId, // lpId가 있을 때만 작동!
  });
};