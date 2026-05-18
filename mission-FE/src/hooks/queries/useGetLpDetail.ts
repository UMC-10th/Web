import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";

export function useGetLpDetail(id: number) {
  return useQuery({
    queryKey: ["lp", id],
    queryFn: () => getLpDetail(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => data.data,
  });
}

export default useGetLpDetail;
