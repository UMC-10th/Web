import { useState } from "react";
import type { Movie } from "../types/movie";
import { useNavigate } from "react-router-dom";

interface Imovie {
    movie: Movie
}

export default function Card({movie}: Imovie) {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const navigate = useNavigate();
    return (
        <div 
        // Movie card 클릭 시 세부 정보가 위치한 경로로 변경 - 경로 전달 시 App.tsx에서 정의해놨던 포맷대로 movieId 전달
        onClick={() => {navigate(`/movies/detail/${movie.id}`)}}
        className="
            relative 
            border-transparent 
            rounded-2xl
            shadow-lg
            overflow-hidden
            cursor-pointer
            w-40
            h-60
            m-4
            transition-transform duration-500 hover:scale-105
        "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
            <img 
                src={import.meta.env.VITE_TMDB_IMG_BASE_URL+movie.poster_path} 
                alt={movie.title}
                className="object-fill h-full"
            />

            {isHovered && (
                <div className="
                    absolute 
                    inset-0 
                    bg-gradient-to-t 
                    from-black/50
                    transparent
                    backdrop-blur-md
                    text-white

                    flex
                    flex-col
                    justify-center
                    items-center

                    p-4
                ">
                    <h2 className="
                        text-lg
                        font-bold
                        text-center
                        leading-snug
                    ">
                        {movie.title}
                    </h2>
                    <p className="
                        text-sm
                        text-gray-300
                        leading-relaxed
                        mt-2
                        line-clamp-5
                    ">
                        {movie.overview}
                    </p>
                </div>
            )}
        </div>
    )
}