import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../apis/lp";
import { useAuth } from "../context/AuthContext";

export const useGetLpDetail = (lpid: string | undefined) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["lp", lpid],
    queryFn: () => getLpDetail(Number(lpid)),
    enabled: !!lpid && !!accessToken,
    staleTime: 1000 * 60 * 5,
  });
};
