import type { Language, Movie, SearchMoviesResponse } from "../types/movie";

// 키는 절대 하드코딩하지 않고 환경변수로만 읽는다. (.env -> import.meta.env)
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// 포스터 이미지 베이스 URL (카드용 w342)
export const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w342";
// 모달용 큰 포스터 (w500)
export const POSTER_BASE_URL_LARGE = "https://image.tmdb.org/t/p/w500";

interface SearchParams {
  query: string;
  includeAdult: boolean;
  language: Language;
}

export async function searchMovies({
  query,
  includeAdult,
  language,
}: SearchParams): Promise<Movie[]> {
  if (!API_KEY) {
    throw new Error(
      "VITE_TMDB_API_KEY 가 설정되지 않았습니다. 루트의 .env 파일을 확인하세요."
    );
  }

  const url = new URL(`${BASE_URL}/search/movie`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("query", query);
  // 성인 콘텐츠 포함 여부 (checkbox state 반영)
  url.searchParams.set("include_adult", String(includeAdult));
  // 언어 (select state 반영)
  url.searchParams.set("language", language);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB 요청 실패: ${res.status}`);
  }

  const data: SearchMoviesResponse = await res.json();
  return data.results;
}
