import { useState } from "react";
import Card from "../components/Card";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PageBtn } from "../components/PageBtn";
import { useParams } from "react-router-dom";
import { useMovies } from "../hooks/useCustomFetch";

const MoviesPage = () => {
  // page state
  const [page, setPage] = useState<number>(1);
  const { category } = useParams<{category: string;}>();

  // custom hook 사용 - useMovies
  const {movies, isPending, isError} = useMovies({category, page});

  // error 발생 시 - error 메시지 보여주도록 처리
  if(isError) {
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

    {/* 로딩 중일 때 스피너 표시되도록 구현 */}
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