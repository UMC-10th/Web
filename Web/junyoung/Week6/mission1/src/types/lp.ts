export interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  likes: number;
  author: string;
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
