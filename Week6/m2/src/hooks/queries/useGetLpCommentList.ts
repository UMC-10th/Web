import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpCommentList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";

type UseGetLpCommentListParams = PaginationDto & {
    lpId?: string;
    enabled?: boolean;
};

function useGetLpCommentList({ lpId, order, limit = 10, enabled = true }: UseGetLpCommentListParams) {
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.lpComments, lpId, order],
        queryFn: ({ pageParam }) => getLpCommentList(lpId as string, {
            cursor: pageParam,
            order,
            limit,
        }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => (
            lastPage.data.hasNext ? lastPage.data.nextCursor : undefined
        ),
        enabled: Boolean(lpId && enabled),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}

export default useGetLpCommentList;
