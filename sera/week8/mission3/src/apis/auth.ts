import type {
  ReqSignInDto,
  ReqSignUpDto,
  ResMyInfoDto,
  ResSignInDto,
  ResSignUpDto,
} from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (_body: ReqSignUpDto): Promise<ResSignUpDto> => {
  await new Promise((res) => setTimeout(res, 300));
  return { status: "SUCCESS", code: 200, message: "ok", data: null } as unknown as ResSignUpDto;
};

export const postSignin = async (body: ReqSignInDto): Promise<ResSignInDto> => {
  await new Promise((res) => setTimeout(res, 300));
  return {
    status: "SUCCESS",
    code: 200,
    message: "ok",
    data: { accessToken: "mock-token", name: body.email.split("@")[0] },
  } as unknown as ResSignInDto;
};

export const getMyInfo = async (): Promise<ResMyInfoDto> => {
  await new Promise((res) => setTimeout(res, 200));
  return {
    status: "SUCCESS",
    code: 200,
    message: "ok",
    data: { id: 1, name: "테스트유저", email: "test@test.com", createdAt: "", updatedAt: "" },
  } as unknown as ResMyInfoDto;
};

export const postLogout = async () => {
  const { data } = await axiosInstance.post("/v1/auth/signout");
  return data;
};

export const updateMyInfo = async (formData: FormData) => {
  const { data } = await axiosInstance.patch("/v1/users/me", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteAccount = async () => {
  const { data } = await axiosInstance.delete("/v1/users/me");
  return data;
};
