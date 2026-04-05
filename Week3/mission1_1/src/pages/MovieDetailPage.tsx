import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { MovieDetail, MovieCredits } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import MovieDetailCard from "../components/MovieDetailCard";

const MovieDetailPage = () => {
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

  return (
    <>
      {/* <SelectButton page={page} setPage={setPage} /> */}
      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {isError && (
        <span>
          <div className="text-red-500 text-2xl">에러가 발생했습니다.</div>
        </span>
      )}

      <MovieDetailCard movieDetail={movieDetail} movieCredits={movieCredits} />
    </>
  );
};

export default MovieDetailPage;
