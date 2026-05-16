import axios from "axios";
import type {
    ReqSignInDto,
    ReqSignUpDto,
    ResMyInfoDto,
    ResSignInDto,
    ResSignUpDto,
    ReqUpdateMyInfoDto,
} from "../types/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const getAuthHeader = () => {
    try {
        const token = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN) ?? "null"
        );
        return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
        return {};
    }
};

export const postSignup = async (body: ReqSignUpDto): Promise<ResSignUpDto> => {
    const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/signup`,
        body
    );
    return data;
};

export const postSignin = async (body: ReqSignInDto): Promise<ResSignInDto> => {
    const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/signin`,
        body
    );
    return data;
};

export const getMyInfo = async (): Promise<ResMyInfoDto> => {
    const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/v1/users/me`,
        { headers: getAuthHeader() }
    );
    return data;
};

export const patchMyInfo = async (
    body: ReqUpdateMyInfoDto
): Promise<ResMyInfoDto> => {
    const { data } = await axios.patch(
        `${import.meta.env.VITE_SERVER_API_URL}/v1/users/me`,
        body,
        { headers: getAuthHeader() }
    );
    return data;
};

export const deleteAccount = async () => {
    await axios.delete(`${import.meta.env.VITE_SERVER_API_URL}/v1/users`, {
        headers: getAuthHeader(),
    });
};

export const postLogout = async () => {
    const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/signout`,
        {},
        { headers: getAuthHeader() }
    );
    return data;
};
