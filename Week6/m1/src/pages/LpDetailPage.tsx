import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getLpDetail } from "../apis/lp";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import { QUERY_KEY } from "../constants/key";
import { useAuth } from "../context/AuthContext";

const getFallbackThumbnail = (id: number) => `https://picsum.photos/seed/lp-${id}/800/800`;

const LpDetailPage = () => {
    const { lpid } = useParams();
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const {
        data,
        isPending,
        isError,
        refetch,
    } = useQuery({
        queryKey: [QUERY_KEY.lp, lpid],
        queryFn: () => getLpDetail(lpid as string),
        enabled: Boolean(lpid && accessToken),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    if (!accessToken) {
        const redirectPath = `${location.pathname}${location.search}`;

        return (
            <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
                <div className="w-full max-w-sm rounded-lg bg-zinc-900 p-6 text-center shadow-xl">
                    <h1 className="mb-3 text-xl font-bold">로그인이 필요합니다.</h1>
                    <p className="mb-6 text-zinc-300">LP 상세 페이지는 로그인 후 확인할 수 있습니다.</p>
                    <button
                        type="button"
                        onClick={() => navigate("/login", { state: { from: redirectPath } })}
                        className="w-full rounded-md bg-pink-500 px-4 py-3 font-semibold hover:bg-pink-400"
                    >
                        확인
                    </button>
                </div>
            </div>
        );
    }

    if (isPending) {
        return <LoadingState variant="detail" />;
    }

    if (isError || !data) {
        return <ErrorState message="LP 상세 정보를 불러오지 못했습니다." onRetry={() => refetch()} />;
    }

    const lp = data.data;

    return (
        <div className="min-h-screen bg-black px-6 py-24 text-white">
            <article className="mx-auto max-w-4xl rounded-lg bg-zinc-900 p-6 shadow-xl md:p-10">
                <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            {lp.author?.avatar && (
                                <img
                                    src={lp.author.avatar}
                                    alt={`${lp.author.name} 프로필`}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            )}
                            <span className="font-semibold">{lp.author?.name ?? "알 수 없는 작성자"}</span>
                        </div>
                        <h1 className="text-3xl font-bold">{lp.title}</h1>
                    </div>
                    <time className="text-sm text-zinc-400">
                        {new Date(lp.createdAt).toLocaleDateString("ko-KR")}
                    </time>
                </header>

                <section className="mb-8 flex justify-center">
                    <img
                        src={lp.thumbnail || getFallbackThumbnail(lp.id)}
                        alt={lp.title}
                        onError={(event) => {
                            event.currentTarget.src = getFallbackThumbnail(lp.id);
                        }}
                        className="aspect-square w-full max-w-xl rounded-lg bg-zinc-800 object-cover shadow-2xl"
                    />
                </section>

                <section className="mb-8">
                    <p className="whitespace-pre-line text-lg leading-8 text-zinc-100">{lp.content}</p>
                </section>

                {lp.tags.length > 0 && (
                    <section className="mb-8 flex flex-wrap gap-2">
                        {lp.tags.map((tag) => (
                            <span key={tag.id} className="rounded-full bg-zinc-700 px-3 py-1 text-sm">
                                # {tag.name}
                            </span>
                        ))}
                    </section>
                )}

                <footer className="flex flex-col gap-4 border-t border-zinc-800 pt-6 md:flex-row md:items-center md:justify-between">
                    <div className="text-xl font-bold text-pink-400">♥ {lp.likes.length}</div>
                    <div className="flex gap-3">
                        <button type="button" className="rounded-md border border-zinc-600 px-4 py-2 hover:bg-zinc-800">
                            수정
                        </button>
                        <button type="button" className="rounded-md border border-zinc-600 px-4 py-2 hover:bg-zinc-800">
                            삭제
                        </button>
                        <button type="button" className="rounded-md bg-pink-500 px-4 py-2 font-semibold hover:bg-pink-400">
                            좋아요
                        </button>
                    </div>
                </footer>
            </article>
        </div>
    );
};

export default LpDetailPage;
