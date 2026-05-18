import axios from 'axios';
import { mockComments } from '../data/mockComments';
import { mockLps } from '../data/mockLps';
import type { CommentPage, Lp, LpComment, LpPage, SortOrder } from '../types/lp';

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

const pageSize = 4;
const commentPageSize = 3;

const slicePage = <T>(items: T[], page: number, size: number) => {
  const start = (page - 1) * size;
  const pageItems = items.slice(start, start + size);
  const nextPage = start + size < items.length ? page + 1 : null;

  return { items: pageItems, nextPage };
};

export const getLps = async (sort: SortOrder): Promise<Lp[]> => {
  try {
    const { data } = await api.get('/v1/lps', { params: { order: sort } });
    const raw = data?.data?.data ?? data?.data?.lps ?? data?.data ?? data;
    return sortLps((Array.isArray(raw) ? raw : []).map(normalizeLp), sort);
  } catch {
    return sortLps(mockLps, sort);
  }
};

export const getLpsPage = async (sort: SortOrder, page: number): Promise<LpPage> => {
  try {
    const { data } = await api.get('/v1/lps', {
      params: { order: sort, page, limit: pageSize },
    });
    const raw = data?.data?.data ?? data?.data?.lps ?? data?.data ?? data;
    const items = (Array.isArray(raw) ? raw : []).map(normalizeLp);
    const nextPage = data?.data?.nextPage ?? data?.data?.nextCursor ?? null;

    if (items.length > 0) {
      return { items, nextPage };
    }
  } catch {
    return slicePage(sortLps(mockLps, sort), page, pageSize);
  }

  return slicePage(sortLps(mockLps, sort), page, pageSize);
};

export const getLp = async (lpid: string): Promise<Lp> => {
  try {
    const { data } = await api.get(`/v1/lps/${lpid}`);
    return normalizeLp(data?.data ?? data);
  } catch {
    return mockLps.find((lp) => String(lp.id) === lpid) ?? mockLps[0];
  }
};

const normalizeComment = (value: Partial<LpComment>, lpId: number): LpComment => ({
  id: Number(value.id),
  lpId,
  author: value.author ?? '익명',
  content: value.content ?? '',
  createdAt: value.createdAt ?? new Date().toISOString(),
});

const sortComments = (comments: LpComment[], order: SortOrder) =>
  [...comments].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return order === 'desc' ? bTime - aTime : aTime - bTime;
  });

export const getLpCommentsPage = async (
  lpId: string,
  order: SortOrder,
  page: number
): Promise<CommentPage> => {
  const numericLpId = Number(lpId);

  try {
    const { data } = await api.get(`/v1/lps/${lpId}/comments`, {
      params: { order, page, limit: commentPageSize },
    });
    const raw = data?.data?.data ?? data?.data?.comments ?? data?.data ?? data;
    const items = (Array.isArray(raw) ? raw : []).map((comment) =>
      normalizeComment(comment, numericLpId)
    );
    const nextPage = data?.data?.nextPage ?? data?.data?.nextCursor ?? null;

    if (items.length > 0) {
      return { items, nextPage };
    }
  } catch {
    const filtered = mockComments.filter((comment) => comment.lpId === numericLpId);
    return slicePage(sortComments(filtered, order), page, commentPageSize);
  }

  const filtered = mockComments.filter((comment) => comment.lpId === numericLpId);
  return slicePage(sortComments(filtered, order), page, commentPageSize);
};
