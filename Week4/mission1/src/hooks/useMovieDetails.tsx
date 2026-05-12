import { useEffect, useState } from "react";
import type { MovieDetail, MovieCredits } from "../types/movie";
import { useParams } from "react-router-dom";
import axios from "axios";

function useMovieDetails() {
  const [movieDetail, setMovieDetail] = useState<MovieDetail>();
  const [movieCredits, setMovieCredits] = useState<MovieCredits>();
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const { movieId } = useParams<{
    movieId: string;
  }>();

  useEffect(() => {
    const getMoviesDetail = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        const { data: detailData } = await axios<MovieDetail>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          },
        );

        const { data: creditData } = await axios<MovieCredits>(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          },
        );

        setMovieDetail(detailData);
        setMovieCredits(creditData);
        setIsPending(false);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    getMoviesDetail();
  }, [movieId]);

  return { movieDetail, movieCredits, isPending, isError };
}

export default useMovieDetails;
