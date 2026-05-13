import { useState } from "react";
import { Link } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import useGetLpList from "../hooks/queries/useGetLpList";

const getFallbackThumbnail = (id: number) => `https://picsum.photos/seed/lp-${id}/600/600`;

const HomePage = () => {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"desc" | "asc">("desc");
    const {data, isPending, isError, refetch, isFetching} = useGetLpList({
        search,
        order: sort,
        limit: 12,
    });

    if(isPending){
        return <LoadingState />;
    }

    if(isError){
        return <ErrorState message="LP 목록을 불러오지 못했습니다." onRetry={() => refetch()} />;
    }

    return (
        <div className="min-h-screen bg-black px-6 py-20 text-white">
            <div className="mx-auto max-w-6xl">
                <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="LP 검색"
                    className="w-full border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-white md:max-w-sm"
                />
                    <div className="flex w-fit overflow-hidden rounded-lg border border-white">
                        <button
                            type="button"
                            onClick={() => setSort("asc")}
                            className={`px-6 py-3 font-bold ${sort === "asc" ? "bg-white text-black" : "bg-black text-white"}`}
                        >
                            오래된순
                        </button>
                        <button
                            type="button"
                            onClick={() => setSort("desc")}
                            className={`px-6 py-3 font-bold ${sort === "desc" ? "bg-white text-black" : "bg-black text-white"}`}
                        >
                            최신순
                        </button>
                    </div>
                </div>

                {isFetching && <p className="mb-4 text-sm text-zinc-400">목록을 갱신하는 중입니다.</p>}

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {data?.data.map((lp) => (
                        <Link
                            key={lp.id}
                            to={`/lp/${lp.id}`}
                            className="group relative aspect-square overflow-hidden bg-zinc-900"
                        >
                            <img
                                src={lp.thumbnail || getFallbackThumbnail(lp.id)}
                                alt={lp.title}
                                onError={(event) => {
                                    event.currentTarget.src = getFallbackThumbnail(lp.id);
                                }}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end bg-black/65 p-6 opacity-0 transition duration-300 group-hover:opacity-100">
                                <h1 className="text-2xl font-bold">{lp.title}</h1>
                                <div className="mt-4 flex items-center justify-between text-lg font-semibold">
                                    <span>{new Date(lp.createdAt).toLocaleDateString("ko-KR")}</span>
                                    <span>♥ {lp.likes.length}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomePage
