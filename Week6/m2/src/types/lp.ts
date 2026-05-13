import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
    id: number;
    name: string;
};

export type Likes = {
    id: number;
    userId: number;
    lpId: number;
};

export type Author = {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
};

export type Lp = {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    author?: Author;
    tags: Tag[];
    likes: Likes[];
};

export type LpComment = {
    id: number;
    content: string;
    lpId: number;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    author?: Author;
};

export type ResponseLpListDto = CursorBasedResponse<{
    data: Lp[];
}>;

export type ResponseLpCommentListDto = CursorBasedResponse<{
    data: LpComment[];
}>;

export type ResponseLpDetailDto = CommonResponse<Lp>;
