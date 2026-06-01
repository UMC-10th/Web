// src/types/lp.ts
import type { CommonRes } from "./common";

// ── LP 단건 ───────────────────────────────────────────────
export type Lp = {
  id: number;
  title: string;
  content?: string;
  thumbnail?: string;
  artist?: string;
  createdAt?: string;
  updatedAt?: string;
  likes?: number | { id: number; userId: number; lpId: number }[];
  isLiked?: boolean;
};

// ── LP 목록 조회 응답 ─────────────────────────────────────
export type GetLpsResponse = CommonRes<{
  data: Lp[];
  cursor: number | null;
  hasNext: boolean;
}>;

// ── LP 단건 조회 응답 ─────────────────────────────────────
export type GetLpDetailResponse = CommonRes<Lp>;

// ── LP 생성 요청 ──────────────────────────────────────────
export type CreateLpDto = {
  title: string;
  content?: string;
  artist?: string;
  tags?: string[];
  thumbnail?: File;
};

// ── LP 수정 요청 ──────────────────────────────────────────
export type UpdateLpDto = Partial<CreateLpDto>;

// ── 댓글 ─────────────────────────────────────────────────
export type LpComment = {
  id: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  author?: {
    id: number;
    name: string;
    avatar?: string;
  };
};

// ── 댓글 목록 조회 응답 ───────────────────────────────────
export type GetLpCommentsResponse = CommonRes<{
  data: LpComment[];
  cursor: number | null;
  hasNext: boolean;
}>;