import { useInfiniteQuery } from "@tanstack/react-query";
import { getLps } from "../apis/lp";

export const useGetLPList = (sort: "latest" | "oldest" = "latest") => {
  return useInfiniteQuery({
    queryKey: ["lps", sort],
    queryFn: ({ pageParam = 0 }) => getLps(sort, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.cursor : undefined;
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};