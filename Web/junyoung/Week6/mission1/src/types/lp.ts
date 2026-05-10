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
