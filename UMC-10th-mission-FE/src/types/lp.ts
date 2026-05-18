// src/types/lp.ts
import type { CommonRes } from "./common";

export type Lp = {
  id: number;
  title: string;      // title 속성 추가
  content?: string;
  thumbnail?: string; // 또는 imageUrl? 형태
  artist?: string;    // LP에 아티스트 정보가 포함될 경우
  createdAt?: string;
  updatedAt?: string;
  likes?: number;
};

export type GetLpsResponse = CommonRes<{
  data: Lp[];
  cursor: number | null;
  hasNext: boolean;
}>;
