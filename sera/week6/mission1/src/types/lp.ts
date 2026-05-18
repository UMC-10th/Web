import type { CommonRes } from "./common";

export type LpTag = {
  id: number;
  name: string;
};

export type LpAuthor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
};

export type LpLike = {
  id: number;
  userId: number;
  lpId: number;
};

export type Lp = {
  id: number;
  title: string;
  content?: string;
  thumbnail?: string;
  authorId?: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
  author?: LpAuthor;
  tags?: LpTag[];
  likes?: LpLike[];
};

export type GetLpsResponse = CommonRes<{
  data: Lp[];
  cursor: number | null;
  hasNext: boolean;
}>;
