import { useInfiniteQuery } from "@tanstack/react-query";
import { getLPComments } from "../apis/lp";

export const useGetLPComments = (
  lpId: string | undefined,
  order: "latest" | "oldest"
) => {
  return useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: ({ pageParam = 0 }) =>
      getLPComments(Number(lpId), order, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.hasNext ? lastPage.data.cursor : undefined;
    },
    enabled: !!lpId,
  });
};