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

export const searchLps = async ({
  cursor,
  query,
  sort = "latest",
}: {
  cursor?: number;
  query: string;
  sort?: "latest" | "oldest";
}): Promise<GetLpsResponse> => {
  console.log("[API 호출] 검색어:", query);
  const { data } = await axiosInstance.get("/v1/lps", {
    params: { cursor, sort, limit: 10, search: query },
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

export const createLp = async (formData: FormData) => {
  const { data } = await axiosInstance.post("/v1/lps", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

export const updateLp = async ({
  lpId,
  formData,
}: {
  lpId: number;
  formData: FormData;
}) => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const createComment = async ({
  lpId,
  content,
}: {
  lpId: number;
  content: string;
}) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });
  return data;
};

export const updateComment = async ({
  lpId,
  commentId,
  content,
}: {
  lpId: number;
  commentId: number;
  content: string;
}) => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content }
  );
  return data;
};

export const deleteComment = async ({
  lpId,
  commentId,
}: {
  lpId: number;
  commentId: number;
}) => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`
  );
  return data;
};

export const toggleLike = async (lpId: number) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};
