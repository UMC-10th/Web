// src/hooks/useGetLpDetail.ts
import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../apis/lp"; // 👈 경로가 맞는지 확인해줘!

export const useGetLpDetail = (lpid: string | undefined) => {
  return useQuery({
    // 💡 퀄리 키에 lpid를 넣어야 "1번 LP"랑 "2번 LP"를 헷갈리지 않아!
    queryKey: ["lp", lpid],
    queryFn: () => getLpDetail(Number(lpid)),
    enabled: !!lpid, // lpid가 있을 때만 비서가 출발하도록 설정!
    staleTime: 1000 * 60 * 5, // 5분 동안은 신선하게 유지
  });
};