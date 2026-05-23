// src/types/lp.ts
import type { CommonRes } from "./common";

export type Like = {
  id: number;
  userId: number;
  lpId: number;
};

export type Lp = {
  id: number;
  title: string;
  content?: string;
  thumbnail?: string;
  artist?: string;
  createdAt?: string;
  updatedAt?: string;
  likes?: Like[];   // API가 좋아요 객체 배열로 반환 — 개수는 .length로 참조
  isLiked?: boolean;
  tags?: string[];
  author?: { id: number; name: string };
};

export type LpDetailResponse = CommonRes<Lp>;

export type GetLpsResponse = CommonRes<{
  data: Lp[];
  cursor: number | null;
  hasNext: boolean;
}>;

export type ReqCreateLpDto = {
  title: string;
  content: string;
  thumbnail?: File | null;
  tags: string[];
};

export type ReqUpdateLpDto = ReqCreateLpDto;

export type CreateLpResponse = CommonRes<Lp>;

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: {
    id: number;
    name: string;
  };
};

export type ReqCreateCommentDto = { content: string };
export type ReqUpdateCommentDto = { content: string };
