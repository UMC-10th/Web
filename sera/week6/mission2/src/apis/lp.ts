import { axiosInstance } from "./axios";
import type { GetLpsResponse, GetCommentsResponse } from "../types/lp";

export const getLps = async ({
  cursor,
  sort = "latest",
}: {
  cursor?: number;
  sort?: "latest" | "oldest";
}): Promise<GetLpsResponse> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: { cursor, sort, limit: 10 },
  });
  return data;
};

export const getLpDetail = async (id: number) => {
  const { data } = await axiosInstance.get(`/v1/lps/${id}`);
  return data;
};

export const getComments = async ({
  lpId,
  cursor,
  order = "latest",
}: {
  lpId: number;
  cursor?: number;
  order?: "latest" | "oldest";
}): Promise<GetCommentsResponse> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { cursor, order, limit: 10 },
  });
  return data;
};
