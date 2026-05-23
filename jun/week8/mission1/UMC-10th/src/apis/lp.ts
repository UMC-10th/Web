import { axiosInstance } from "./axios";
import type { GetLpsResponse } from "../types/lp";

export const getLpList = async (
  order: "asc" | "desc" = "desc",
  cursor?: number,
  limit: number = 10,
  search?: string
): Promise<GetLpsResponse> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: {
      ...(cursor ? { cursor } : {}),
      limit,
      order,
      ...(search ? { search } : {}),
    },
  });
  return data;
};

export const getLpDetail = async (lpId: number) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data;
};

export const createLp = async (formData: FormData) => {
  const { data } = await axiosInstance.post("/v1/lps", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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

export const deleteLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

export const toggleLike = async (lpId: number, isLiked: boolean) => {
  if (isLiked) {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
    return data;
  } else {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
    return data;
  }
};

export const getLPComments = async (
  lpId: number,
  order: "asc" | "desc" = "desc",
  cursor: number = 0,
  limit: number = 10
) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: {
      ...(cursor ? { cursor } : {}),
      limit,
      order,
    },
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