import { useInfiniteQuery } from "@tanstack/react-query";
import { getLPComments } from "../apis/lp";

export const useGetLPComments = (lpId: string | undefined, order: "latest" | "oldest") => {
  const serverOrder = order === "latest" ? "desc" : "asc";

  return useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: ({ pageParam = 0 }) =>
      getLPComments(Number(lpId), serverOrder, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.hasNext ? lastPage.data.nextCursor : undefined;
    },
    enabled: !!lpId,
  });
};