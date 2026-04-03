import {useState} from 'react';
import type {Movie} from '../types/movie';

interface MovieCardProps{
    movie: Movie;
}


export default function MovieCard({movie}:MovieCardProps){
    const [isHovered, setIsHovered] = useState(false);
    

    return (
    <div className='relative rounded-xl shadow-lg overflow-hidden cursor-pointer w-full transition-transform duration-500 hover:scale-105'
    onMouseEnter={():void => setIsHovered(true)}
    onMouseLeave={():void => setIsHovered(false)}
    >
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
        alt={`${movie.title} 영화의 이미지`}
        className='w-full h-auto object-cover'
        />


        {isHovered &&(
            <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md flex flex-col justify-center 
            items-center text-white'>
                <h2 className='text-lg font-bold text-center leading-snug'>{movie.title}</h2>
                <p className='text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5'>{movie.overview}</p>
            </div>
        )}
    </div>
    );
}