import { useNavigate } from 'react-router-dom';
import type { Lp } from '../types/lp';
import { useAuth } from '../context/AuthContext';

interface LpCardProps {
  lp: Lp;
}

export default function LpCard({ lp }: LpCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다. 로그인을 해주세요!');
      navigate('/login');
      return;
    }
    navigate(`/lp/${lp.id}`);
  };

  return (
    <div
      className="relative group cursor-pointer overflow-hidden aspect-square rounded"
      onClick={handleClick}
    >
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <h3 className="text-white text-sm font-semibold line-clamp-2">{lp.title}</h3>
        <p className="text-gray-300 text-xs mt-1">
          {new Date(lp.createdAt).toLocaleDateString('ko-KR')}
        </p>
        <p className="text-gray-300 text-xs">❤️ {lp.likes.length}</p>
      </div>
    </div>
  );
}