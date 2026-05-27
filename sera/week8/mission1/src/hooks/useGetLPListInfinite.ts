import { useInfiniteQuery } from "@tanstack/react-query";
import { getLps } from "../apis/lp";

export const useGetLpListInfinite = (sort: "latest" | "oldest" = "latest") => {
  return useInfiniteQuery({
    queryKey: ["lps", sort],
    queryFn: ({ pageParam }) => getLps({ cursor: pageParam, sort }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? (lastPage.data.cursor ?? undefined) : undefined,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};
