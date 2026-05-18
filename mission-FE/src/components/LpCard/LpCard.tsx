import { Link } from "react-router-dom";
import type { Lp } from "../../types/lp";

interface LpCardProps {
  lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
  return (
    <Link
      to={`/lp/${lp.id}`}
      className="group relative block rounded-xl overflow-hidden bg-[#242424] hover:shadow-xl hover:shadow-black/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
    >
      <div className="aspect-video w-full bg-black relative">
        {lp.thumbnail ? (
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
            No Image
          </div>
        )}
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-semibold">자세히 보기</span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-2">
        <h2 className="text-lg font-bold text-white truncate">{lp.title}</h2>
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>{new Date(lp.createdAt).toLocaleDateString()}</span>
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span>{lp.likes?.length || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LpCard;
