import type { CommonRes } from "./common";

export type ReqSignUpDto = {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  password: string;
};

export type ResSignUpDto = CommonRes<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}>;

export type ReqSignInDto = {
  email: string;
  password: string;
};

export type ResSignInDto = CommonRes<{
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}>;

export type ResMyInfoDto = CommonRes<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}>;