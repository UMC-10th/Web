import { useEffect,useState } from "react"; 
import axios from 'axios';
import type {Movie, MovieResponse} from '../types/movie';
import MovieCard from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function MoviePage(){
    const [movies,setMovies]=useState<Movie[]>([]);
// 1. 로딩 상태를 추가합니다. 
const [isPending, setIsPending] = useState(false);
// 2. 에러 상태를 추가합니다.
const [isError, setIsError]= useState(false);
//3. 페이지를 추가합니다.
const [page, setPage]=useState(1);

   useEffect(() :void =>{
    const fetchMovies = async() : Promise<void> => {
        setIsPending(true);
        try{
            const {data} = await axios.get<MovieResponse>(
        `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`,
       {
        headers:{
            Authorization : `Bearer ${import.meta.env.VITE_TMDB_KEY}`
        },
       }
    
    );

        setMovies(data.results);
        } catch{
            setIsError(true);
        } finally{
            setIsPending(false);
        }
    };

    fetchMovies();
   }, [page]);

   if(isError){
    return(
        <div>
            <span className='text-red-500 text-2xl'>에러가 발생했습니다. </span>
        </div>
    )
   }

    if (isPending){
        return <LoadingSpinner />
    }

    return (
    <>
        <div>
            <button
            disabled={page === 1}
            onClick={():void => setPage((prev):number => prev -1)}>
            {`<`}</button>
            <span>{page} 페이지</span>
            <button
                onClick={():void => setPage((prev):number => prev -1)}>
            {`>`}</button>
            

        </div>

        <div className='p-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
            ))} 
        </div>
    </>
    );
}