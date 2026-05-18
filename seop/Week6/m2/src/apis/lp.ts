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