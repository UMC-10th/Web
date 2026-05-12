import { LoadingSpinner } from "../components/LoadingSpinner";
import MovieDetailCard from "../components/MovieDetailCard";
import useMovieDetails from "../hooks/useMovieDetails";

const MovieDetailPage = () => {
  const { movieDetail, movieCredits, isPending, isError } = useMovieDetails();

  if (isError) {
    return (
      <span>
        <div className="text-red-500 text-2xl">에러가 발생했습니다.</div>
      </span>
    );
  }

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
