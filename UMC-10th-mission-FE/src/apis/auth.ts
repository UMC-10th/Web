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

// 회원가입 (토큰 불필요 → 기본 axios)
export const postSignup = async (body: ReqSignUpDto): Promise<ResSignUpDto> => {
  const { data } = await axios.post(`${BASE_URL}/v1/auth/signup`, body);
  return data;
};

// 로그인 (토큰 불필요 → 기본 axios)
export const postSignin = async (body: ReqSignInDto): Promise<ResSignInDto> => {
  const { data } = await axios.post(`${BASE_URL}/v1/auth/signin`, body);
  return data;
};

// 내 정보 조회 (토큰 필요 → axiosInstance 사용, Hook 규칙 위반 제거)
export const getMyInfo = async (): Promise<ResMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");
  return data;
};

// 로그아웃 (서버에 알림, 토큰 필요할 수 있음 → axiosInstance)
export const postLogout = async () => {
  const { data } = await axiosInstance.post("/v1/auth/signout");
  return data;
};
