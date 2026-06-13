// TMDB search/movie 응답에서 우리가 사용하는 필드만 추린 타입
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  adult: boolean;
  release_date?: string;
}

export interface SearchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export type Language = "ko-KR" | "en-US" | "ja-JP";
