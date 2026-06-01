import { Link } from 'react-router-dom';
import type { Lp } from '../types/lp';

interface LpCardProps {
  lp: Lp;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(new Date(date));

const LpCard = ({ lp }: LpCardProps) => {
  return (
    <Link
      to={`/lp/${lp.id}`}
      className="group relative aspect-square overflow-hidden rounded-md bg-gray-900"
    >
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-black/0 p-4 opacity-0 transition duration-300 group-hover:bg-black/65 group-hover:opacity-100">
        <h2 className="text-base font-bold text-white">{lp.title}</h2>
        <p className="mt-1 text-xs text-gray-300">{formatDate(lp.createdAt)}</p>
        <p className="mt-2 text-sm text-pink-200">좋아요 {lp.likes}</p>
      </div>
    </Link>
  );
};

export default LpCard;
