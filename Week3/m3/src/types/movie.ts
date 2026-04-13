export type Movie = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
};

export type MovieResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
};

export interface MovieDetails {
    adult: boolean;
    backdrop_path: string | null;
    genres: { id: number; name: string }[];
    id: number;
    overview: string;
    poster_path: string | null;
    release_date: string;
    runtime: number | null;
    tagline: string;
    title: string;
    vote_average: number;
    vote_count: number;
}

/** TMDB GET /movie/{movie_id}/credits */
export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
}

export interface CrewMember {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
}

export interface Credits {
    id: number;
    cast: CastMember[];
    crew: CrewMember[];
}