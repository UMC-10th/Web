import axios from "axios";
import type { PaginationDto } from "../types/common";
import type { ResponseLpListDto, ReqCreateLpDto } from "../types/lp";
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

export const getLpList = async (
    paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
    const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/v1/lps`,
        { params: paginationDto }
    );
    return data;
};

export const postLp = async (body: ReqCreateLpDto) => {
    const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/v1/lps`,
        body,
        { headers: getAuthHeader() }
    );
    return data;
};

export const updateLp = async ({
    lpId,
    body,
}: {
    lpId: number;
    body: Partial<ReqCreateLpDto>;
}) => {
    const { data } = await axios.patch(
        `${import.meta.env.VITE_SERVER_API_URL}/v1/lps/${lpId}`,
        body,
        { headers: getAuthHeader() }
    );
    return data;
};

export const deleteLpApi = async (lpId: number) => {
    await axios.delete(
        `${import.meta.env.VITE_SERVER_API_URL}/v1/lps/${lpId}`,
        { headers: getAuthHeader() }
    );
};

export const addLike = async (lpId: number) => {
    const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/v1/lps/${lpId}/likes`,
        {},
        { headers: getAuthHeader() }
    );
    return data;
};

export const removeLike = async (lpId: number) => {
    const { data } = await axios.delete(
        `${import.meta.env.VITE_SERVER_API_URL}/v1/lps/${lpId}/likes`,
        { headers: getAuthHeader() }
    );
    return data;
};

export const postComment = async ({
    lpId,
    content,
}: {
    lpId: number;
    content: string;
}) => {
    const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/v1/lps/${lpId}/comments`,
        { content },
        { headers: getAuthHeader() }
    );
    return data;
};

export const updateComment = async ({
    lpId,
    commentId,
    content,
}: {
    lpId: number;
    commentId: number;
    content: string;
}) => {
    const { data } = await axios.patch(
        `${import.meta.env.VITE_SERVER_API_URL}/v1/lps/${lpId}/comments/${commentId}`,
        { content },
        { headers: getAuthHeader() }
    );
    return data;
};

export const deleteComment = async ({
    lpId,
    commentId,
}: {
    lpId: number;
    commentId: number;
}) => {
    await axios.delete(
        `${import.meta.env.VITE_SERVER_API_URL}/v1/lps/${lpId}/comments/${commentId}`,
        { headers: getAuthHeader() }
    );
};
