import { useEffect, useRef, useState } from "react";
import { useGetLpList } from "../hooks/queries/useGetLpList";

export default function Home() {
    const [search, setSearch] = useState("");
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const observerRef = useRef<HTMLDivElement | null>(null);

    const {
        data,
        isLoading,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetLpList({
        search,
        order,
        limit: 10,
    });

    const lpList = data?.pages.flatMap((page) => page.data.data) ?? []; 
    /*여러 페이지 LP 배열
→ 한 개의 LP 배열로 합치기*/

    useEffect(() => {
        if (!observerRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });

        observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (isLoading) {
        return (
            <div className="w-full h-full p-8">
                <SkeletonGrid />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full h-full p-8">
                <p>LP 목록을 불러오지 못했습니다.</p>
                <button onClick={() => refetch()}>다시 시도</button>
            </div>
        );
    }

    return (
        <div className="w-full h-full p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#063B3D]">LP 목록</h1>

                <div className="flex gap-2">
                    <button
                        onClick={() => setOrder("desc")}
                        className="px-3 py-2 rounded-sm bg-[#0ECFD3] text-[#063B3D] font-bold"
                    >
                        최신순
                    </button>
                    <button
                        onClick={() => setOrder("asc")}
                        className="px-3 py-2 rounded-sm bg-[#B7EDEA] text-[#063B3D] font-bold"
                    >
                        오래된순
                    </button>
                </div>
            </div>

            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-[#ccccccc8] rounded-sm w-[400px] focus:border-[#0ECFD3] outline-none p-[8px] mb-6"
                placeholder="LP 검색"
            />

            {lpList.length === 0 && (
                <p className="text-[#063B3D]">등록된 LP가 없습니다.</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {lpList.map((lp) => (
                    <div
                        key={lp.id}
                        className="h-[220px] rounded-md bg-white border border-[#B7EDEA] p-4 shadow-sm hover:scale-105 transition"
                    >
                        <h2 className="font-bold text-[#063B3D]">{lp.title}</h2>
                    </div>
                ))}
            </div>

            {isFetchingNextPage && (
                <div className="mt-4">
                    <SkeletonGrid />
                </div>
            )}

            <div ref={observerRef} className="h-10" />
        </div>
    );
}

function SkeletonGrid() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
                <div
                    key={index}
                    className="h-[220px] rounded-md bg-[#B7EDEA] animate-pulse"
                />
            ))}
        </div>
    );
}