import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PaginationDto } from "../../types/common";
import { QUERY_KEY } from "../../constants/key";

export const useGetLpList = ({ search, order, limit }: PaginationDto) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.lps, search, order],
        queryFn: ({ pageParam }) =>
            getLpList({
                cursor: pageParam,
                search,
                order,
                limit,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

/*initialPageParam: 0
→ 첫 요청 cursor는 0

queryFn: ({ pageParam }) => ...
→ 현재 페이지 cursor를 서버에 넘김

getNextPageParam
→ 다음 페이지가 있으면 nextCursor 반환
→ 없으면 undefined 반환*/