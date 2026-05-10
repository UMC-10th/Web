import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLpDetail } from '../apis/lp';
import { useAuth } from '../context/AuthContext';

export default function LpDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['lp', lpId],
    queryFn: () => getLpDetail(Number(lpId)),
  });

  const lp = data?.data;

  if (isPending) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-10 h-10 border-4 border-gray-600 border-t-pink-500 rounded-full animate-spin" />
    </div>
  );

  if (isError) return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4">
      <p className="text-red-400">데이터를 불러오는데 실패했습니다.</p>
      <button onClick={() => refetch()} className="bg-pink-500 text-white px-4 py-2 rounded">
        다시 시도
      </button>
    </div>
  );

  if (!lp) return null;

  return (
    <div className="flex justify-center p-8">
      <div className="bg-[#2a2a3e] rounded-xl p-8 w-full max-w-2xl">
        {/* 작성자 & 날짜 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
              {lp.author.name[0]}
            </div>
            <span className="text-white font-semibold">{lp.author.name}</span>
          </div>
          <span className="text-gray-400 text-sm">
            {new Date(lp.createdAt).toLocaleDateString('ko-KR')}
          </span>
        </div>

        {/* 제목 & 수정/삭제 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-2xl font-bold">{lp.title}</h1>
          {user?.id === lp.authorId && (
            <div className="flex gap-3">
              <button className="text-gray-400 hover:text-white">✏️</button>
              <button className="text-gray-400 hover:text-red-400">🗑️</button>
            </div>
          )}
        </div>

        {/* 썸네일 */}
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="w-full rounded-lg mb-6 object-cover"
        />

        {/* 본문 */}
        <p className="text-gray-300 mb-6 leading-relaxed">{lp.content}</p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {lp.tags.map((tag) => (
            <span key={tag.id} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
              # {tag.name}
            </span>
          ))}
        </div>

        {/* 좋아요 */}
        <div className="flex justify-center">
          <button className="flex items-center gap-2 text-pink-400 hover:text-pink-300">
            ❤️ {lp.likes.length}
          </button>
        </div>
      </div>
    </div>
  );
}