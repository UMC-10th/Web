import { useNavigate } from "react-router-dom";
import type { Movie } from "../types/movie";
import { useState } from "react";

interface MovieCardProps {
    movie: Movie;   
}

export default function MovieCard({ movie }: MovieCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
        : null;

    return ( 
        <div 
        onClick={() => navigate(`/movies/${movie.id}`)} 
        className='relative w-44 overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
            {posterUrl ? (
                <img
                    src={posterUrl}
                    alt={`${movie.title} 영화의 이미지`}
                    className='h-64 w-full object-cover'
                />
            ) : (
                <div className='flex h-64 w-full items-center justify-center bg-zinc-200 p-4 text-center text-sm text-zinc-600'>
                    포스터 이미지가 없습니다.
                </div>
            )}
            {isHovered && <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md flex flex-col justify-center items-center text-white p-4'>
                <h2 className='text-lg font-bold text-center leading-snug'>{movie.title}</h2>
                <p className='mt-2 line-clamp-5 text-sm leading-relaxed text-gray-200'>{movie.overview || "줄거리가 없습니다."}</p>
            </div>}
        </div>
    );
} 
