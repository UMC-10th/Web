import { axiosInstance } from "./axios";
import type { GetLpsResponse } from "../types/lp";

export const getLps = async (
  sort: "latest" | "oldest" = "latest",
  cursor: number = 0
): Promise<GetLpsResponse> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: { sort, cursor, limit: 10 },
  });
  return data;
};

export const getLpDetail = async (id: number) => {
  const { data } = await axiosInstance.get(`/v1/lps/${id}`);
  return data;
};

export const getLPComments = async (
  lpId: number,
  order: "latest" | "oldest" = "latest",
  cursor: number = 0
) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { order, cursor, limit: 10 },
  });
  return data;
};