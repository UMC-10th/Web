import { useState, useEffect } from "react";
import axios from "axios";
import type { Movie, MovieResponse } from "../types/movie";
import type { MovieDetails } from "../types/movie_detail";
import type { CreditsResponse, Person } from "../types/credits";

interface MoviesParams {
    category ?: string;
    page: number;
}

interface EachMovieParams {
    movieId: string;
}

// 영화 페이지 불러오는 데 사용할 custom hook
export const useMovies = ({category, page}: MoviesParams) => {
    const [movies, setMovies] = useState<Movie[]>([]);
      
    // 1. loading state
    const [isPending, setIsPending] = useState<boolean>(false);
    
    // 2. error state
    const [isError, setIsError] = useState<boolean>(false);
      
    // 3. 의존성 변경 시 자동으로 데이터 재요청하도록 구현
    useEffect(() => {
    const fetchMovies = async () : Promise<void> => {
        setIsPending(true);
        setIsError(false); // 새 요청 시작 시 에러 상태 초기화
        try {
            const {data} = await axios.get<MovieResponse>(
                `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
                { 
                    headers: {
                    // TMDB token
                        Authorization: import.meta.env.VITE_TMDB_KEY
                    }
                }
            );
        setMovies(data.results);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false); // 로딩 상태 초기화
        setIsError(false); // 에러 상태 초기화
      }
    };
    // API 호출해서 data get  
    fetchMovies();
  }, [page, category]); // page가 바뀔때, category가 바뀔때마다 새 데이터를 가져와야하기 때문에 의존성 배열에 둘 모두 추가함

  return {movies, isPending, isError}; // 차례대로 데이터, 로딩 상태, 에러 상태 반환
}

// 영화 별 상세 페이지에서 사용할 custom hook
export const useEachMovie = ({movieId}: EachMovieParams) => {
    const [movieDetails, setMovieDetails] = useState<MovieDetails>();
    const [cast, setCast] = useState<Person[]>([]);
    const [crew, setCrew] = useState<Person[]>([]);
    // 1. loading state
    const [isPending, setIsPending] = useState<boolean>(false);

    // 2. error state
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        const fetchMovieDetails = async () : Promise<void> => {
            setIsPending(true);
            console.log(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`)
            try {
                // 영화 상세 정보와 출연진/제작진 정보를 병렬로 호출 (성능 최적화)
                const [detailsRes, creditsRes] = await Promise.all([
                    axios.get<MovieDetails>(
                            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
                            { headers: { Authorization: import.meta.env.VITE_TMDB_KEY } }
                        ),
                        axios.get<CreditsResponse>(
                            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
                            { headers: { Authorization: import.meta.env.VITE_TMDB_KEY } }
                        )
                    ]);
                
                // 영화 상세 정보 및 출연진/제작진 정보를 update
                setMovieDetails(detailsRes.data);
                setCast(creditsRes.data.cast);
                setCrew(creditsRes.data.crew);
    
                } catch {
                    setIsError(true);
                } finally {
                    setIsPending(false);
                    setIsError(false);
                }
            };
            fetchMovieDetails();
    }, [movieId]); // movieId가 바뀔때 마다 업데이트를 해야하기 때문에 의존성 배열에 추가함

    return {isError, isPending, movieDetails, cast, crew}
}