import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getLp } from '../api/lps';

const LpDetailPage = () => {
  const { lpid = '' } = useParams();
  const { data: lp, isLoading, isError, refetch } = useQuery({
    queryKey: ['lp', lpid],
    queryFn: () => getLp(lpid),
    enabled: Boolean(lpid),
  });

  if (isLoading) {
    return <div className="mx-auto h-[520px] max-w-3xl animate-pulse rounded-md bg-gray-800" />;
  }

  if (isError || !lp) {
    return (
      <div className="mx-auto max-w-3xl rounded-md border border-red-500/40 bg-red-500/10 p-5 text-red-100">
        상세 정보를 불러오지 못했습니다.
        <button onClick={() => refetch()} className="ml-3 font-semibold underline">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl">
      <img src={lp.thumbnail} alt={lp.title} className="aspect-square w-full rounded-md object-cover" />
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">{lp.author}</p>
          <h1 className="mt-1 text-2xl font-bold">{lp.title}</h1>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-200">수정</button>
          <button className="rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-200">삭제</button>
          <button className="rounded-md bg-pink-500 px-3 py-2 text-sm font-semibold text-white">
            좋아요 {lp.likes}
          </button>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-300">{new Date(lp.createdAt).toLocaleString('ko-KR')}</p>
      <p className="mt-6 leading-7 text-gray-100">{lp.content}</p>
    </article>
  );
};

export default LpDetailPage;
