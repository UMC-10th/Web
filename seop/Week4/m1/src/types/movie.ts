export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

export interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
}