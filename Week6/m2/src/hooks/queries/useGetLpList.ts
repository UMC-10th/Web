import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ search, order, limit = 10 }: PaginationDto) {
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.lps, order],
        queryFn: ({ pageParam }) => getLpList({
            cursor: pageParam,
            search,
            order,
            limit
        }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => (
            lastPage.data.hasNext ? lastPage.data.nextCursor : undefined
        ),
        staleTime: 1000 * 60 * 5, 
        gcTime: 1000 * 60 * 10, 
    });
}

export default useGetLpList;
