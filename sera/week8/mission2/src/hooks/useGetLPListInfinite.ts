import { useInfiniteQuery } from "@tanstack/react-query";

// 더미 데이터 - throttle 테스트용 무한 스크롤
const MOCK_LPS = [
  { id: 1, title: "Vorax chirographum artificiose", thumbnail: "https://loremflickr.com/300/300?lock=1", likes: [] },
  { id: 2, title: "Patrocinor amicitia sordeo", thumbnail: "https://loremflickr.com/300/300?lock=2", likes: [] },
  { id: 3, title: "Denique vulpes aufero expedita", thumbnail: "https://loremflickr.com/300/300?lock=3", likes: [] },
  { id: 4, title: "Tui comes patior aurum ceno", thumbnail: "https://loremflickr.com/300/300?lock=4", likes: [] },
  { id: 5, title: "Adhaero solvo infit cibo", thumbnail: "https://loremflickr.com/300/300?lock=5", likes: [] },
  { id: 6, title: "Decens vulgus audio nisi", thumbnail: "https://loremflickr.com/300/300?lock=6", likes: [] },
  { id: 7, title: "Adulescens cognatus trepide", thumbnail: "https://loremflickr.com/300/300?lock=7", likes: [] },
  { id: 8, title: "Tandem spiculum consuasor", thumbnail: "https://loremflickr.com/300/300?lock=8", likes: [] },
  { id: 9, title: "Vulticulus denuo antiquus", thumbnail: "https://loremflickr.com/300/300?lock=9", likes: [] },
  { id: 10, title: "Socius inflammatio aranea", thumbnail: "https://loremflickr.com/300/300?lock=10", likes: [] },
];

const fetchMockPage = async (page: number) => {
  // 실제 API 호출처럼 약간의 딜레이
  await new Promise((res) => setTimeout(res, 300));
  // page 번호를 id offset으로 써서 무한히 다른 id 생성
  const offset = page * 10;
  const data = MOCK_LPS.map((lp) => ({ ...lp, id: lp.id + offset }));
  return {
    data: {
      data,
      cursor: page + 1,
      hasNext: true, // 항상 다음 페이지 있음
    },
  };
};

export const useGetLpListInfinite = (sort: "latest" | "oldest" = "latest") => {
  return useInfiniteQuery({
    queryKey: ["lps", sort],
    queryFn: ({ pageParam = 0 }) => fetchMockPage(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data.cursor,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};
