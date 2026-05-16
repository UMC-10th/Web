import { axiosInstance } from './axios';
import type { LpListResponse, LpDetailResponse } from '../types/lp';

export const getLpList = async (order: string = 'desc') => {
  const response = await axiosInstance.get<LpListResponse>('/lps', {
    params: { order, cursor: 0, limit: 20 },
  });
  return response.data;
};

export const getLpDetail = async (lpId: number) => {
  const response = await axiosInstance.get<LpDetailResponse>(`/lps/${lpId}`);
  return response.data;
};