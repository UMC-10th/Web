import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";

export const useGetMyInfo = (accessToken: string | null) => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: getMyInfo,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 60,
  });
};
