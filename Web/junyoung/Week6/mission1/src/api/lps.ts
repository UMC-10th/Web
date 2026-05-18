import axios from 'axios';
import { mockLps } from '../data/mockLps';
import type { Lp, SortOrder } from '../types/lp';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
});

const normalizeLp = (value: Partial<Lp>): Lp => ({
  id: Number(value.id),
  title: value.title ?? '제목 없는 LP',
  content: value.content ?? '',
  thumbnail: value.thumbnail ?? 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80',
  createdAt: value.createdAt ?? new Date().toISOString(),
  likes: value.likes ?? 0,
  author: value.author ?? '익명',
});

const sortLps = (lps: Lp[], sort: SortOrder) =>
  [...lps].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return sort === 'desc' ? bTime - aTime : aTime - bTime;
  });

export const getLps = async (sort: SortOrder): Promise<Lp[]> => {
  try {
    const { data } = await api.get('/v1/lps', { params: { order: sort } });
    const raw = data?.data?.data ?? data?.data?.lps ?? data?.data ?? data;
    return sortLps((Array.isArray(raw) ? raw : []).map(normalizeLp), sort);
  } catch {
    return sortLps(mockLps, sort);
  }
};

export const getLp = async (lpid: string): Promise<Lp> => {
  try {
    const { data } = await api.get(`/v1/lps/${lpid}`);
    return normalizeLp(data?.data ?? data);
  } catch {
    return mockLps.find((lp) => String(lp.id) === lpid) ?? mockLps[0];
  }
};
