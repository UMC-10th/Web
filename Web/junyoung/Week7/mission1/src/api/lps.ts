import axios from 'axios';
import { mockComments } from '../data/mockComments';
import { mockLps } from '../data/mockLps';
import type {
  CommentPage,
  CreateCommentPayload,
  CreateLpPayload,
  Lp,
  LpComment,
  LpPage,
  SortOrder,
  UpdateCommentPayload,
  UpdateLpPayload,
  UserProfile,
} from '../types/lp';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
});

let localLps = [...mockLps];
let localComments = [...mockComments];
let localProfile: UserProfile = {
  nickname: '준영',
  bio: '',
  avatar: '',
};

const normalizeLp = (value: Partial<Lp>): Lp => ({
  id: Number(value.id),
  title: value.title ?? '제목 없는 LP',
  content: value.content ?? '',
  thumbnail: value.thumbnail ?? 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80',
  createdAt: value.createdAt ?? new Date().toISOString(),
  likes: value.likes ?? 0,
  author: value.author ?? '익명',
  tags: value.tags ?? [],
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
    return sortLps(localLps, sort);
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
    return slicePage(sortLps(localLps, sort), page, pageSize);
  }

  return slicePage(sortLps(localLps, sort), page, pageSize);
};

export const getLp = async (lpid: string): Promise<Lp> => {
  try {
    const { data } = await api.get(`/v1/lps/${lpid}`);
    return normalizeLp(data?.data ?? data);
  } catch {
    return localLps.find((lp) => String(lp.id) === lpid) ?? localLps[0];
  }
};

export const createLp = async (payload: CreateLpPayload): Promise<Lp> => {
  try {
    const { data } = await api.post('/v1/lps', payload);
    const created = normalizeLp(data?.data ?? data);
    localLps = [created, ...localLps];
    return created;
  } catch {
    const created: Lp = {
      id: Math.max(0, ...localLps.map((lp) => lp.id)) + 1,
      title: payload.title,
      content: payload.content,
      thumbnail:
        payload.thumbnail ||
        'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString(),
      likes: 0,
      author: payload.author,
      tags: payload.tags,
    };
    localLps = [created, ...localLps];
    return created;
  }
};

export const updateLp = async (payload: UpdateLpPayload): Promise<Lp> => {
  try {
    const { data } = await api.patch(`/v1/lps/${payload.id}`, payload);
    const updated = normalizeLp(data?.data ?? data);
    localLps = localLps.map((lp) => (lp.id === payload.id ? { ...lp, ...updated } : lp));
    return updated;
  } catch {
    const previous = localLps.find((lp) => lp.id === payload.id) ?? localLps[0];
    const updated: Lp = {
      ...previous,
      title: payload.title,
      content: payload.content,
      thumbnail: payload.thumbnail || previous.thumbnail,
      tags: payload.tags ?? previous.tags,
    };
    localLps = localLps.map((lp) => (lp.id === payload.id ? updated : lp));
    return updated;
  }
};

export const deleteLp = async (id: number): Promise<{ id: number }> => {
  try {
    await api.delete(`/v1/lps/${id}`);
  } catch {
    // Local fallback below keeps the mission usable without a backend.
  }

  localLps = localLps.filter((lp) => lp.id !== id);
  localComments = localComments.filter((comment) => comment.lpId !== id);
  return { id };
};

export const toggleLpLike = async (id: number): Promise<Lp> => {
  try {
    const { data } = await api.post(`/v1/lps/${id}/likes`);
    const updated = normalizeLp(data?.data ?? data);
    localLps = localLps.map((lp) => (lp.id === id ? { ...lp, ...updated } : lp));
    return updated;
  } catch {
    const previous = localLps.find((lp) => lp.id === id) ?? localLps[0];
    const updated = { ...previous, likes: previous.likes + 1 };
    localLps = localLps.map((lp) => (lp.id === id ? updated : lp));
    return updated;
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
    const filtered = localComments.filter((comment) => comment.lpId === numericLpId);
    return slicePage(sortComments(filtered, order), page, commentPageSize);
  }

  const filtered = localComments.filter((comment) => comment.lpId === numericLpId);
  return slicePage(sortComments(filtered, order), page, commentPageSize);
};

export const createComment = async (payload: CreateCommentPayload): Promise<LpComment> => {
  try {
    const { data } = await api.post(`/v1/lps/${payload.lpId}/comments`, payload);
    const created = normalizeComment(data?.data ?? data, payload.lpId);
    localComments = [created, ...localComments];
    return created;
  } catch {
    const created: LpComment = {
      id: Math.max(0, ...localComments.map((comment) => comment.id)) + 1,
      lpId: payload.lpId,
      author: payload.author,
      content: payload.content,
      createdAt: new Date().toISOString(),
    };
    localComments = [created, ...localComments];
    return created;
  }
};

export const updateComment = async ({
  lpId,
  commentId,
  content,
}: UpdateCommentPayload): Promise<LpComment> => {
  try {
    const { data } = await api.patch(`/v1/lps/${lpId}/comments/${commentId}`, { content });
    const updated = normalizeComment(data?.data ?? data, lpId);
    localComments = localComments.map((comment) =>
      comment.id === commentId ? { ...comment, ...updated } : comment
    );
    return updated;
  } catch {
    const previous = localComments.find((comment) => comment.id === commentId);
    const updated = { ...(previous as LpComment), content };
    localComments = localComments.map((comment) => (comment.id === commentId ? updated : comment));
    return updated;
  }
};

export const deleteComment = async ({
  lpId,
  commentId,
}: {
  lpId: number;
  commentId: number;
}): Promise<{ commentId: number }> => {
  try {
    await api.delete(`/v1/lps/${lpId}/comments/${commentId}`);
  } catch {
    // Local fallback below keeps the mission usable without a backend.
  }

  localComments = localComments.filter((comment) => comment.id !== commentId);
  return { commentId };
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ accessToken: string; nickname: string }> => {
  try {
    const { data } = await api.post('/v1/auth/signin', { email, password });
    return {
      accessToken: data?.data?.accessToken ?? data?.accessToken ?? 'week7-demo-token',
      nickname: data?.data?.nickname ?? data?.nickname ?? '준영',
    };
  } catch {
    return { accessToken: 'week7-demo-token', nickname: '준영' };
  }
};

export const logout = async (): Promise<{ success: boolean }> => {
  try {
    await api.post('/v1/auth/logout');
  } catch {
    // Client cleanup is handled by the caller.
  }

  return { success: true };
};

export const withdraw = async (): Promise<{ success: boolean }> => {
  try {
    await api.delete('/v1/users/me');
  } catch {
    // Client cleanup is handled by the caller.
  }

  return { success: true };
};

export const getMyProfile = async (): Promise<UserProfile> => localProfile;

export const updateMyProfile = async (payload: UserProfile): Promise<UserProfile> => {
  try {
    const { data } = await api.patch('/v1/users/me', payload);
    localProfile = { ...payload, ...(data?.data ?? data) };
    return localProfile;
  } catch {
    localProfile = payload;
    return localProfile;
  }
};
