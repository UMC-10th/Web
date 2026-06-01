import { axiosInstance } from './axios';
import type { LpListResponse, LpDetailResponse, CommentListResponse } from '../types/lp';

export const getLpList = async ({
  cursor = 0,
  order = 'desc',
  limit = 12,
}: {
  cursor?: number;
  order?: string;
  limit?: number;
}) => {
  const response = await axiosInstance.get<LpListResponse>('/lps', {
    params: { cursor, order, limit },
  });
  return response.data;
};

export const getLpDetail = async (lpId: number) => {
  const response = await axiosInstance.get<LpDetailResponse>(`/lps/${lpId}`);
  return response.data;
};

export const createLp = async (formData: FormData) => {
  const response = await axiosInstance.post('/lps', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateLp = async ({ lpId, formData }: { lpId: number; formData: FormData }) => {
  const response = await axiosInstance.patch(`/lps/${lpId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteLp = async (lpId: number) => {
  const response = await axiosInstance.delete(`/lps/${lpId}`);
  return response.data;
};

export const postLike = async (lpId: number) => {
  const response = await axiosInstance.post(`/lps/${lpId}/likes`);
  return response.data;
};

export const deleteLike = async (lpId: number) => {
  const response = await axiosInstance.delete(`/lps/${lpId}/likes`);
  return response.data;
};

export const getComments = async ({
  lpId,
  cursor = 0,
  order = 'desc',
  limit = 10,
}: {
  lpId: number;
  cursor?: number;
  order?: string;
  limit?: number;
}) => {
  const response = await axiosInstance.get<CommentListResponse>(
    `/lps/${lpId}/comments`,
    { params: { cursor, order, limit } }
  );
  return response.data;
};

export const createComment = async ({ lpId, content }: { lpId: number; content: string }) => {
  const response = await axiosInstance.post(`/lps/${lpId}/comments`, { content });
  return response.data;
};

export const updateComment = async ({ lpId, commentId, content }: { lpId: number; commentId: number; content: string }) => {
  const response = await axiosInstance.patch(`/lps/${lpId}/comments/${commentId}`, { content });
  return response.data;
};

export const deleteComment = async ({ lpId, commentId }: { lpId: number; commentId: number }) => {
  const response = await axiosInstance.delete(`/lps/${lpId}/comments/${commentId}`);
  return response.data;
};