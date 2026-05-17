import type { SortOrder } from '../types/lp';

export const lpKeys = {
  all: ['lps'] as const,
  lists: () => [...lpKeys.all, 'list'] as const,
  list: (sort: SortOrder) => [...lpKeys.lists(), sort] as const,
  detail: (id: string) => [...lpKeys.all, 'detail', id] as const,
};

export const commentKeys = {
  all: ['lpComments'] as const,
  list: (lpId: string, order: SortOrder) => [...commentKeys.all, lpId, order] as const,
};

export const userKeys = {
  me: ['user', 'me'] as const,
};
