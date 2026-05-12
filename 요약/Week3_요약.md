# Week 3 작업 요약

## 📁 경로
`Web/junyoung/Week3/`

---

## 📌 무엇을 만드나?
**TMDB API**를 활용한 영화 목록 & 상세 페이지 앱

Tailwind CSS + React Router + useEffect 세 가지 핵심 기술을 결합하여 총 3단계 미션으로 진행:

| 단계 | 내용 |
|------|------|
| 미션 1 | useEffect로 인기 영화 목록 불러오기 + Tailwind CSS로 UI 구성 |
| 미션 2 | React Router로 멀티 페이지 구성 + 로딩/에러 처리 + 페이지네이션 |
| 미션 3 | useParams로 영화 상세 페이지 (포스터·줄거리·출연진) 구현 |

---

## 📁 파일 구조

```
mission/
├── src/
│   ├── pages/
│   │   ├── home.tsx           ← 홈 페이지
│   │   ├── movies.tsx         ← 영화 목록 (미션 1~2)
│   │   ├── movie-detail.tsx   ← 영화 상세 (미션 3)
│   │   └── not-found.tsx      ← 404 페이지
│   ├── layout/
│   │   └── root-layout.tsx    ← Navbar + Outlet (공통 레이아웃)
│   ├── components/
│   │   └── navbar.tsx         ← 네비게이션 바
│   ├── types/
│   │   └── movie.ts           ← Movie, MovieResponse 타입 정의
│   ├── App.tsx                ← createBrowserRouter 라우터 설정
│   └── main.tsx               ← 앱 진입점
├── index.html
└── package.json
```

---

## 🎨 Tailwind CSS 핵심

### Utility-First 방식
CSS 파일을 따로 작성하지 않고, 클래스 조합으로 스타일을 완성:

```tsx
<div className="p-4 bg-blue-500 text-center hover:bg-blue-600 md:text-lg">
  예시
</div>
```

| 클래스 | 의미 |
|--------|------|
| `p-4` | padding: 1rem |
| `bg-blue-500` | background-color: #3B82F6 |
| `text-center` | text-align: center |
| `hover:bg-blue-600` | 마우스 올렸을 때 색상 변경 |
| `md:text-lg` | 768px 이상에서만 적용 |
| `dark:bg-black` | 다크모드에서 적용 |

- 반응형: `sm:`, `md:`, `lg:`, `xl:`
- 상태: `hover:`, `focus:`, `active:`, `disabled:`
- JIT 엔진: 실제로 쓴 클래스만 빌드에 포함 → CSS 용량 최소화

---

## 🗺️ React Router 핵심

### CSR vs SSR
- **CSR** (React Router 방식): 첫 접속 시 JS를 한 번 받고, 이후 페이지 이동은 전체 새로고침 없이 필요한 부분만 교체
- **SSR**: 페이지 이동마다 서버에서 새 HTML을 받아옴 → 새로고침 발생

### 기본 라우터 설정

```tsx
// App.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layout/root-layout';
import HomePage from './pages/home';
import Movies from './pages/movies';
import NotFound from './pages/not-found';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,       // 공통 레이아웃 (Navbar 포함)
    errorElement: <NotFound />,    // 없는 경로 → 이 컴포넌트 표시
    children: [
      { index: true, element: <HomePage /> },         // '/' 경로
      { path: 'movies', element: <Movies /> },        // '/movies' 경로
      { path: 'movies/:movieId', element: <MovieDetail /> }, // 동적 라우팅
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

### Outlet — 공통 레이아웃

```tsx
// src/layout/root-layout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar';

const RootLayout = () => (
  <>
    <Navbar />      {/* Navbar는 항상 고정 */}
    <Outlet />      {/* 자식 라우트가 이 자리에 렌더링됨 */}
  </>
);
```

### Link & NavLink

```tsx
import { Link, NavLink } from 'react-router-dom';

// 일반 링크 (페이지 전체 새로고침 없이 이동)
<Link to="/movies">영화 목록</Link>

// 현재 경로와 일치하면 active 스타일 자동 적용
<NavLink to="/movies" className={({ isActive }) => isActive ? 'text-yellow-400' : ''}>
  영화 목록
</NavLink>
```

### 동적 라우팅 — useParams

```tsx
// path: 'movies/:movieId' 로 설정한 뒤
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
  const { movieId } = useParams(); // URL의 :movieId 값을 꺼냄
  // movieId로 API 호출
};
```

---

## ⚡ useEffect 핵심

### 세 가지 실행 시점

```tsx
// 1. 처음 마운트될 때 한 번만
useEffect(() => { fetchData(); }, []);

// 2. page 값이 바뀔 때마다
useEffect(() => { fetchData(); }, [page]);

// 3. 리렌더링마다 (의존성 배열 생략)
useEffect(() => { doSomething(); });
```

### 주의: async/await 사용법
useEffect 콜백은 동기 함수여야 하기 때문에 **내부에서 async 함수를 정의하고 호출**해야 함:

```tsx
useEffect(() => {
  const fetchMovies = async () => {
    const { data } = await axios.get<MovieResponse>(URL, { headers });
    setMovies(data.results);
  };
  fetchMovies(); // 바로 실행
}, []);
```

### 클린업 함수
이벤트 리스너 등록처럼 정리가 필요한 작업에 사용:

```tsx
useEffect(() => {
  window.addEventListener('click', handler);
  return () => {
    window.removeEventListener('click', handler); // 클린업
  };
}, [counter]);
```
- 리렌더링 직전마다 이전 클린업이 먼저 실행됨
- 중복 이벤트 등록, 메모리 누수 방지

---

## 🎬 TMDB API 연동

### 타입 정의

```tsx
// src/types/movie.ts
export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
};

export type MovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};
```

### API 호출 (axios)

```tsx
const { data } = await axios.get<MovieResponse>(
  'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
  { headers: { Authorization: `Bearer ${TOKEN}` } }
);
```

### 로딩 & 에러 처리 패턴

```tsx
const [movies, setMovies] = useState<Movie[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<MovieResponse>(URL, { headers });
      setMovies(data.results);
    } catch (e) {
      setError('데이터를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  fetch();
}, [page]);

if (isLoading) return <Spinner />;
if (error) return <p>{error}</p>;
```

---

## 🔄 전체 흐름

### 미션 1 — useEffect로 영화 목록 불러오기

```
컴포넌트 마운트
  → useEffect([]) 실행 (처음 한 번만)
  → axios로 TMDB popular API 호출
  → setMovies로 상태 저장
  → movies.map()으로 포스터 카드 그리드 렌더링
  → 마우스 hover → Tailwind hover: 클래스로 blur + 제목/줄거리 표시
```

### 미션 2 — React Router + 페이지네이션 + 로딩/에러 처리

```
URL 접근 (/movies)
  → React Router → RootLayout 렌더링 (Navbar 고정)
  → Outlet 자리에 Movies 컴포넌트 렌더링
  → useEffect([page]) 실행
  → isLoading = true → 로딩 스피너 표시
  → axios로 TMDB API 호출 (page 파라미터 포함)
    ├─ 성공 → setMovies 저장, isLoading = false
    └─ 실패 → setError 저장, 에러 메시지 표시
  → 영화 카드 그리드 렌더링
  → 이전/다음 버튼 클릭 → page 상태 변경 → useEffect 재실행
  → Navbar의 NavLink → 현재 경로 일치 시 active 스타일 적용
```

### 미션 3 — useParams로 영화 상세 페이지

```
영화 카드 클릭 → Link to="/movies/:movieId"
  → React Router → path 'movies/:movieId' 매칭
  → MovieDetail 컴포넌트 렌더링
  → useParams()로 URL에서 movieId 추출
  → useEffect([movieId]) 실행
  → axios로 두 API 병렬 호출
      ├─ /movie/:movieId          → 상세 정보 (제목, 줄거리, 평점, 포스터)
      └─ /movie/:movieId/credits  → 출연진/제작진
  → 로딩 중 → 스피너 표시
  → 성공 → 포스터 + 상세 정보 + 출연진 목록 렌더링
  → 실패 → 에러 메시지 표시
```

---

## 💡 Week 3 핵심 개념 정리

### Tailwind CSS vs 기존 CSS
| 기존 CSS | Tailwind CSS |
|----------|--------------|
| 별도 `.css` 파일 관리 | JSX에서 클래스 직접 작성 |
| 클래스명 충돌 위험 | 유틸리티 클래스로 충돌 없음 |
| CSS 파일 커짐 | JIT으로 사용한 것만 빌드 |

### Query Parameter
- URL에 `?key=value&key2=value2` 형태로 추가 정보 전달
- `?language=ko-KR&page=2` → 한국어, 2페이지 요청

### Optional Chaining
- 데이터가 아직 `undefined`일 때 에러 방지
- `movies?.map(...)` — movies가 undefined면 그냥 undefined 반환

### fetch vs axios
| | fetch | axios |
|--|-------|-------|
| 설치 | 브라우저 내장 | `pnpm install axios` 필요 |
| JSON 처리 | `res.json()` 수동 호출 | 자동으로 JSON 파싱 |
| 에러 처리 | 4xx/5xx도 성공으로 처리 | 4xx/5xx를 자동으로 에러로 처리 |
| 타입 지원 | 제한적 | `axios.get<T>()` 제네릭 지원 |
