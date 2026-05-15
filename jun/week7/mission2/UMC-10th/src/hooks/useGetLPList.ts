import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../apis/lp";

export const useGetLPList = (sort: "asc" | "desc" = "desc") => {
  return useInfiniteQuery({
    queryKey: ["lps", sort],
    queryFn: ({ pageParam }) =>
      getLpList(sort, pageParam === 0 ? undefined : pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.cursor : undefined;
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};