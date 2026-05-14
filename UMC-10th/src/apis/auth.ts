import axios from "axios";
import type {
  ReqSignInDto,
  ReqSignUpDto,
  ResMyInfoDto,
  ResSignInDto,
  ResSignUpDto,
} from "../types/auth";
import { axiosInstance } from "./axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const postSignup = async (body: ReqSignUpDto): Promise<ResSignUpDto> => {
  const { data } = await axios.post(`${BASE_URL}/v1/auth/signup`, body);
  return data;
};

export const postSignin = async (body: ReqSignInDto): Promise<ResSignInDto> => {
  const { data } = await axios.post(`${BASE_URL}/v1/auth/signin`, body);
  return data;
};

export const getMyInfo = async (): Promise<ResMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");
  return data;
};

export const postLogout = async () => {
  const { data } = await axiosInstance.post("/v1/auth/signout");
  return data;
};

export const patchMyInfo = async ({
  name,
  bio,
  avatar,
}: {
  name: string;
  bio?: string;
  avatar?: string;
}) => {
  const { data } = await axiosInstance.patch("/v1/users", {  // ✅ /me 제거
    name,
    bio,
    avatar,
  });
  return data;
};

export const deleteMyAccount = async () => {
  const { data } = await axiosInstance.delete("/v1/users");  // ✅ /me 제거
  return data;
};