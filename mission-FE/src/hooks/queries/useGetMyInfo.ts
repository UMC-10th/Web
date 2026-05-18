import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";

export const useGetMyInfo = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useGetMyInfo;
