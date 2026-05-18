import axios from "axios"
import type { PaginationDto } from "../types/common"
import type { ResponseLpListDto } from "../types/lp";

export const getLpList = async (paginationDto: PaginationDto): Promise<ResponseLpListDto> => {
    const {data} = await axios.get(`${import.meta.env.VITE_SERVER_API_URL}/v1/lps`, {
        params: paginationDto,
    });

    return data;
};