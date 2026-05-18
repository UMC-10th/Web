import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export function useGetLpList({ cursor, limit, search, order }: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, order],
    queryFn: () => getLpList({ cursor, limit, search, order }),

    // 데이터가 신선하다고 생각하는 시간
    // 5분 동안 기존 데이터 활용
    staleTime: 1000 * 60 * 5,

    // 사용되지 않는 데이터가 메모리에서 제거되는 시간
    // 10분 동안 사용되지 않으면 데이터 제거
    gcTime: 1000 * 60 * 10,

    select: (data) => data.data.data,
  });
}

export default useGetLpList;
