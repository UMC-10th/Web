import { useCallback, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getLpDetail } from "../apis/lp";
import CommentSkeleton from "../components/CommentSkeleton";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import { QUERY_KEY } from "../constants/key";
import { useAuth } from "../context/AuthContext";
import useGetLpCommentList from "../hooks/queries/useGetLpCommentList";
import type { PAGINATION_ORDER } from "../enums/common";

const getFallbackThumbnail = (id: number) => `https://picsum.photos/seed/lp-${id}/800/800`;
const getFallbackAvatar = (id: number) => `https://picsum.photos/seed/comment-author-${id}/80/80`;
const commentSkeletons = Array.from({ length: 5 });

const LpDetailPage = () => {
    const { lpid } = useParams();
    const lpId = lpid;
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [commentValue, setCommentValue] = useState("");
    const commentObserver = useRef<IntersectionObserver | null>(null);
    const orderParam = searchParams.get("order");
    const commentOrder: PAGINATION_ORDER = orderParam === "asc" ? "asc" : "desc";
    const {
        data,
        isPending,
        isError,
        refetch,
    } = useQuery({
        queryKey: [QUERY_KEY.lp, lpId],
        queryFn: () => getLpDetail(lpId as string),
        enabled: Boolean(lpId && accessToken),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
    const {
        data: commentsData,
        isLoading: isCommentsLoading,
        isFetchingNextPage: isFetchingNextComments,
        hasNextPage: hasNextComments,
        fetchNextPage: fetchNextComments,
    } = useGetLpCommentList({
        lpId,
        order: commentOrder,
        enabled: Boolean(accessToken),
    });
    const comments = commentsData?.pages.flatMap((page) => page.data.data) ?? [];
    const isCommentValid = commentValue.trim().length > 0;

    const setLastCommentRef = useCallback((node: HTMLElement | null) => {
        if (isCommentsLoading || isFetchingNextComments) {
            return;
        }

        if (commentObserver.current) {
            commentObserver.current.disconnect();
        }

        if (!node) {
            return;
        }

        commentObserver.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasNextComments) {
                    fetchNextComments();
                }
            },
            {
                root: null,
                rootMargin: "320px 0px",
                threshold: 0,
            },
        );
        commentObserver.current.observe(node);
    }, [fetchNextComments, hasNextComments, isCommentsLoading, isFetchingNextComments]);

    const handleCommentOrderChange = (nextOrder: PAGINATION_ORDER) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set("order", nextOrder);
        setSearchParams(nextParams);
    };

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

                <section className="mt-10 border-t border-zinc-800 pt-8">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <h2 className="text-2xl font-bold">댓글</h2>
                        <div className="flex w-fit overflow-hidden rounded-lg border border-white">
                            <button
                                type="button"
                                onClick={() => handleCommentOrderChange("asc")}
                                className={`px-5 py-2 font-bold ${commentOrder === "asc" ? "bg-white text-black" : "bg-zinc-900 text-white"}`}
                            >
                                오래된순
                            </button>
                            <button
                                type="button"
                                onClick={() => handleCommentOrderChange("desc")}
                                className={`px-5 py-2 font-bold ${commentOrder === "desc" ? "bg-white text-black" : "bg-zinc-900 text-white"}`}
                            >
                                최신순
                            </button>
                        </div>
                    </div>

                    <div className="mb-2 flex gap-3">
                        <input
                            value={commentValue}
                            onChange={(event) => setCommentValue(event.target.value)}
                            placeholder="댓글을 입력해주세요"
                            className="min-w-0 flex-1 rounded-md border border-zinc-600 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-white"
                        />
                        <button
                            type="button"
                            disabled={!isCommentValid}
                            className="rounded-md bg-zinc-500 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                        >
                            작성
                        </button>
                    </div>
                    <p className={`mb-8 text-sm ${isCommentValid ? "text-zinc-500" : "text-pink-300"}`}>
                        댓글은 1자 이상 입력해주세요.
                    </p>

                    <div className="space-y-6">
                        {isCommentsLoading && commentSkeletons.map((_, index) => (
                            <CommentSkeleton key={`initial-comment-skeleton-${index}`} />
                        ))}

                        {comments.map((comment, index) => {
                            const isLastComment = index === comments.length - 1;

                            return (
                            <article
                                key={comment.id}
                                ref={isLastComment ? setLastCommentRef : undefined}
                                className="flex gap-3"
                            >
                                <img
                                    src={comment.author?.avatar || getFallbackAvatar(comment.id)}
                                    alt={`${comment.author?.name ?? "익명"} 프로필`}
                                    onError={(event) => {
                                        event.currentTarget.src = getFallbackAvatar(comment.id);
                                    }}
                                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                                />
                                <div className="min-w-0">
                                    <h3 className="font-bold">{comment.author?.name ?? "익명"}</h3>
                                    <p className="break-words text-zinc-100">{comment.content}</p>
                                </div>
                            </article>
                            );
                        })}

                        {isFetchingNextComments && commentSkeletons.map((_, index) => (
                            <CommentSkeleton key={`next-comment-skeleton-${index}`} />
                        ))}
                    </div>

                    {comments.length === 0 && !isCommentsLoading && (
                        <div className="py-8 text-center text-zinc-500">아직 댓글이 없습니다.</div>
                    )}
                </section>
            </article>
        </div>
    );
};

export default LpDetailPage;
