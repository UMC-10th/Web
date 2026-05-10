import { axiosInstance } from "./axios";
import type { GetLpsResponse } from "../types/lp";

export const getLps = async (
  sort: "latest" | "oldest" = "latest"
): Promise<GetLpsResponse> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: { sort },
  });
  return data;
};

export const getLpDetail = async (id: number) => {
  const { data } = await axiosInstance.get(`/v1/lps/${id}`);
  return data;
};
