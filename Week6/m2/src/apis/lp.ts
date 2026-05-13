import type { PaginationDto } from "../types/common";
import type { ResponseLpCommentListDto, ResponseLpDetailDto, ResponseLpListDto } from "../types/lp";
import axiosInstance from "./axios";

export const getLpList = async (paginationDto: PaginationDto): Promise<ResponseLpListDto> => {
    const {data} = await axiosInstance.get("/v1/lps", {
        params: paginationDto,
    });

    return data;
}; 

export const getLpDetail = async (lpid: string): Promise<ResponseLpDetailDto> => {
    const {data} = await axiosInstance.get(`/v1/lps/${lpid}`);

    return data;
};

export const getLpCommentList = async (
    lpId: string,
    paginationDto: PaginationDto,
): Promise<ResponseLpCommentListDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
        params: paginationDto,
    });

    return data;
};
