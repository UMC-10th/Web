import { useInfiniteQuery } from "@tanstack/react-query";
import { searchLps } from "../apis/lp";

export const useSearchLpListInfinite = (
  query: string,
  sort: "latest" | "oldest" = "latest"
) => {
  const trimmed = query.trim();

  return useInfiniteQuery({
    queryKey: ["search", trimmed, sort],
    queryFn: ({ pageParam }) =>
      searchLps({ cursor: pageParam, query: trimmed, sort }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? (lastPage.data.cursor ?? undefined) : undefined,
    enabled: trimmed.length > 0,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 3,
  });
};
