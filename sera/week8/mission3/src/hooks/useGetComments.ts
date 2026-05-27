import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "../apis/lp";

export const useGetComments = (
  lpId: number,
  order: "latest" | "oldest" = "latest"
) => {
  return useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: ({ pageParam }) => getComments({ lpId, cursor: pageParam, order }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? (lastPage.data.cursor ?? undefined) : undefined,
    staleTime: 1000 * 60,
  });
};
