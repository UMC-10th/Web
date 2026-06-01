export interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  likes: number;
  author: string;
  tags?: string[];
}

export type SortOrder = 'desc' | 'asc';

export interface LpPage {
  items: Lp[];
  nextPage: number | null;
}

export interface LpComment {
  id: number;
  lpId: number;
  author: string;
  content: string;
  createdAt: string;
}

export interface CommentPage {
  items: LpComment[];
  nextPage: number | null;
}

export interface CreateLpPayload {
  title: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  author: string;
}

export interface UpdateLpPayload {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  tags?: string[];
}

export interface CreateCommentPayload {
  lpId: number;
  content: string;
  author: string;
}

export interface UpdateCommentPayload {
  lpId: number;
  commentId: number;
  content: string;
}

export interface UserProfile {
  nickname: string;
  bio: string;
  avatar: string;
}
