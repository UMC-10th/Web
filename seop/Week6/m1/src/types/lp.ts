export interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: {
    id: number;
    name: string;
    avatar: string | null;
  };
  tags: {
    id: number;
    name: string;
  }[];
  likes: {
    id: number;
    userId: number;
    lpId: number;
  }[];
}

export interface LpListResponse {
  data: {
    data: Lp[];
    nextCursor: number | null;
    hasNext: boolean;
  };
  message: string;
  status: boolean;
  statusCode: number;
}

export interface LpDetailResponse {
  data: Lp;
  message: string;
  status: boolean;
  statusCode: number;
}