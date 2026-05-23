import { axiosInstance } from "./axios";
import type {
  CreateLpResponse,
  GetLpsResponse,
  LpDetailResponse,
  ReqCreateCommentDto,
  ReqCreateLpDto,
  ReqUpdateCommentDto,
  ReqUpdateLpDto,
} from "../types/lp";

// 검색어 기반 LP 목록 조회 (SearchPage 전용)
export const searchLps = async (
  query: string,
  cursor: number = 0
): Promise<GetLpsResponse> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: { search: query, cursor, limit: 10 },
  });
  return data;
};

export const getLps = async (
  sort: "latest" | "oldest" = "latest",
  cursor: number = 0
): Promise<GetLpsResponse> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: { sort, cursor, limit: 10 },
  });
  return data;
};

export const getLpDetail = async (id: number): Promise<LpDetailResponse> => {
  const { data } = await axiosInstance.get(`/v1/lps/${id}`);
  return data;
};

export const getLpComments = async (
  lpId: number,
  order: "latest" | "oldest" = "latest",
  cursor: number = 0
) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { order, cursor, limit: 10 },
  });
  return data;
};

export const postComment = async (lpId: number, body: ReqCreateCommentDto) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, body);
  return data;
};

export const patchComment = async (
  lpId: number,
  commentId: number,
  body: ReqUpdateCommentDto
) => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    body
  );
  return data;
};

export const deleteComment = async (lpId: number, commentId: number) => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`
  );
  return data;
};

const buildLpFormData = (body: ReqCreateLpDto | ReqUpdateLpDto): FormData => {
  const formData = new FormData();
  formData.append("title", body.title);
  formData.append("content", body.content);
  if (body.thumbnail) formData.append("thumbnail", body.thumbnail);
  body.tags.forEach((tag) => formData.append("tags", tag));
  return formData;
};

export const postLp = async (body: ReqCreateLpDto): Promise<CreateLpResponse> => {
  const { data } = await axiosInstance.post("/v1/lps", buildLpFormData(body), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const patchLp = async (
  id: number,
  body: ReqUpdateLpDto
): Promise<CreateLpResponse> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${id}`, buildLpFormData(body), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteLp = async (id: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${id}`);
  return data;
};

export const postLpLike = async (id: number) => {
  const { data } = await axiosInstance.post(`/v1/lps/${id}/likes`);
  return data;
};
