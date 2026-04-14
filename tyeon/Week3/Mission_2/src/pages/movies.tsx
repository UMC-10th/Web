import { useEffect, useState } from "react";
import type { Movie, MovieResponse } from "../types/movie";
import axios from "axios"
import Card from "../components/Card";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PageBtn } from "../components/PageBtn";
import { useParams } from "react-router";

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  
  // 1. loading state
  const [isPending, setIsPending] = useState<boolean>(false);

  // 2. error state
  const [isError, setIsError] = useState<boolean>(false);

  // 3. page state
  const [page, setPage] = useState<number>(1);

  const { category } = useParams<{category: string;}>();

  useEffect(() => {
    // useEffect callback func -> 반드시 동기함수!
    // 그렇기 때문에 useEffect 내부에서 async func을 따로 정의해 바로 호출하는 방식을 이용!
    // fetch로 가져오면 response를 json을 이용해 한 번 풀어줘야 하지만, axios를 이용한다면 해당 과정 생략 가능
    const fetchMovies = async () : Promise<void> => {
      setIsPending(true);

      try {
        const {data} = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              // TMDB token
              Authorization: import.meta.env.VITE_TMDB_KEY
          }}
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

  if(isError) { // error 발생 시
    return (
      <div className="flex justify-center items-center text-2xl text-red-400">
        <span>Error 발생!</span>
      </div>
    );
  }

  return (
  <>
    <div className="flex justify-center items-center gap-8">
      <PageBtn text="<" page={page} onPage={setPage} isToNext={false}/>
      <span>{page}</span>
      <PageBtn text=">" page={page} onPage={setPage} isToNext={true}/>
    </div>

    {isPending && 
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
    }

    {!isPending &&
      <div
        className="
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        lg:grid-cols-5 
        xl:grid-cols-6
        gap-x-1
        gap-y-1
        justify-self-center
        "
      >
        {/* 혹시 모를 경우, 즉 movie가 undefined / null인 경우에 대비해 optional chaining 활용 */}
        {movies?.map((movie) =>
          <Card key={movie.id} movie={movie}/>
        )}
      </div>
    }
  </>
  );
};

export default MoviesPage;