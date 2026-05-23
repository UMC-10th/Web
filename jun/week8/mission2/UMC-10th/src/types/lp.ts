// src/types/lp.ts
import type { CommonRes } from "./common";

export type Lp = {
  id: number;
  title: string;      
  content?: string;
  thumbnail?: string; 
  artist?: string;   
  createdAt?: string;
  updatedAt?: string;
  likes?: number;
};

export type GetLpsResponse = CommonRes<{
  data: Lp[];
  nextCursor: number | null;
  hasNext: boolean;
}>;