import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { Heart } from "lucide-react";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";

const LpDetailPage = () => {
  const { lpId } = useParams();
  const { accessToken } = useAuth();

  const {
    data: lp,
    isPending,
    isError,
  } = useGetLpDetail({ lpId: Number(lpId) });

  const { data: me } = useGetMyInfo(accessToken);
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();

  // const isLiked = lp?.data.likes
  //   .map((like) => like.userId)
  //   .includes(me?.data.id as number);
  const isLiked = lp?.data.likes.some((like) => like.userId === me?.data.id);

  const handleLikeLp = async () => {
    likeMutate({ lpId: Number(lpId) });
  };

  const handleDislikeLp = async () => {
    disLikeMutate({ lpId: Number(lpId) });
  };

  // if (isPending && isError) {
  //   return <></>;
  // }

  if (isPending) {
    return <div className="mt-12">로딩 중...</div>;
  }

  if (isError || !lp?.data) {
    return <div className="mt-12">LP 정보를 불러오지 못했습니다.</div>;
  }
  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <article className="bg-[#151515] p-6 rounded-2xl shadow-md border border-white/5">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-white leading-tight">
              {lp.data.title}
            </h1>
            <div className="mt-2 text-sm text-gray-400 flex flex-wrap items-center gap-3">
              <span>{new Date(lp.data.createdAt).toLocaleDateString()}</span>
              <span className="text-gray-500">·</span>
              <span>작성자: {lp.data.authorId}</span>
              <span className="text-gray-500">·</span>
              <span>{lp.data.likes?.length ?? 0} 좋아요</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={isLiked ? handleDislikeLp : handleLikeLp}
              aria-label={isLiked ? "좋아요 취소" : "좋아요"}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition"
            >
              <Heart
                color={isLiked ? "#ef4444" : "#ffffff"}
                fill={isLiked ? "#ef4444" : "transparent"}
              />
              <span className="text-sm">{isLiked ? "좋아요" : "좋아요"}</span>
            </button>
          </div>
        </header>

        <div className="mt-6 w-full rounded-lg overflow-hidden bg-black">
          <div className="aspect-video w-full bg-black">
            <img
              src={lp.data.thumbnail}
              alt={lp.data.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <section className="mt-6 text-gray-200 leading-relaxed whitespace-pre-wrap bg-white/2 p-6 rounded-lg">
          {lp.data.content}
        </section>

        {lp.data.tags && lp.data.tags.length > 0 && (
          <footer className="mt-4 flex flex-wrap gap-2">
            {lp.data.tags.map((tag: any) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-white/5 text-sm rounded-full text-gray-300"
              >
                #{tag.name}
              </span>
            ))}
          </footer>
        )}
      </article>
    </div>
  );
};

export default LpDetailPage;
