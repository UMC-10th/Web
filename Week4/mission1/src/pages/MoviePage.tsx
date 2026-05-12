import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { SelectButton } from "../components/SelectButton";
import useMovies from "../hooks/useMovies";

export default function MoviePage() {
  const { movies, isPending, isError, page, setPage } = useMovies();

  if (isError) {
    return (
      <span>
        <div className="text-red-500 text-2xl">에러가 발생했습니다.</div>
      </span>
    );
  }

  return (
    <>
      <SelectButton page={page} setPage={setPage} />
      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div
          className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
        xl:grid-cols-6"
        >
          {movies?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
