# 🎥 TMDB 영화 검색 + 렌더링 최적화 미션

Vite + React + TypeScript 로 만든 TMDB 영화 검색 사이트입니다.
`memo` / `useCallback` / `useMemo` 로 불필요한 리렌더를 제거하는 과정을 콘솔 로그로 확인할 수 있습니다.

## 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정 (루트 .env)
#    .env.example 을 복사해 .env 로 만들고 본인 TMDB 키를 넣으세요.
#    VITE_TMDB_API_KEY=발급받은_키
#    ※ .env 는 .gitignore 에 포함되어 커밋되지 않습니다.

# 3. 개발 서버 실행
npm run dev      # http://localhost:5173

# (선택) 타입체크 + 프로덕션 빌드
npm run build
```

## 폴더 구조 (이번 미션에서 만든 파일)

```
.
├─ .env                      # VITE_TMDB_API_KEY (git 미추적)
├─ .env.example             # 키 자리표시자 템플릿
├─ .gitignore               # .env 포함
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ src/
   ├─ main.tsx
   ├─ App.tsx               # MovieSearch 렌더
   ├─ index.css
   ├─ vite-env.d.ts         # VITE_TMDB_API_KEY 타입 선언
   ├─ apis/
   │  └─ tmdb.ts            # search/movie 호출 (키는 import.meta.env 로만 사용)
   ├─ types/
   │  └─ movie.ts           # Movie / 응답 / Language 타입
   └─ components/
      ├─ MovieSearch.tsx    # 부모: 검색 폼 + 상태 + 최적화 훅
      └─ MovieCard.tsx      # 자식: memo 적용 카드
```

## 단계별 구현 내용

### 1단계 — 기본 검색 기능 (`MovieSearch.tsx`)
- 상단 검색 영역을 `<form>` 으로 감싸 **엔터만으로도 검색** (`onSubmit` + `e.preventDefault()`).
- 영화 제목 `text input` — `placeholder="영화 제목을 입력하세요"`, 값은 `title` state.
- 성인 콘텐츠 `checkbox` — `includeAdult` boolean state → API `include_adult` 파라미터.
- 언어 `select` — 한국어(`ko-KR`)·영어(`en-US`)·일본어(`ja-JP`), `language` state → API `language` 파라미터.
- TMDB `search/movie` 호출 후 포스터·제목·평점·개요를 리스트로 렌더.
- **로딩 상태** 표시, **빈 검색어**(`trim()` 후 빈 값)는 호출하지 않음.

### 2단계 — 리렌더 추적 로그
- 부모(`MovieSearch`)와 자식(`MovieCard`)에 각각 `console.log` 삽입.
- 검색어를 타이핑하면 `title` state가 바뀌어 부모가 리렌더되고,
  최적화 전에는 **목록이 그대로인데도 모든 카드가 다시 렌더**되는 걸 콘솔에서 볼 수 있음.

### 3단계 — 최적화 적용
- **`memo`** (`MovieCard.tsx`): 카드 컴포넌트를 메모이제이션 → `movie`, `onSelect` props가 같으면 리렌더 건너뜀.
- **`useCallback`** (`MovieSearch.tsx`의 `handleSelect`): memo된 카드에 넘기는 핸들러의 **참조를 고정**.
  인라인 함수로 넘기면 매 렌더마다 새 함수가 되어 memo가 무력화되므로 필수.
- **`useMemo`** (`sortedMovies`): 평점순 정렬을 `movies`가 바뀔 때만 재계산.
- 반대로 **`handleSubmit`** 은 form에서만 쓰고 자식에게 넘기지 않으므로 `useCallback`으로 감싸지 않음(효과 없음).

## 최적화 전 / 후 콘솔 로그 차이

검색 결과가 떠 있는 상태에서 **검색창에 글자 한 개를 타이핑**할 때:

| 구분 | 부모 로그 | 카드 로그 |
| --- | --- | --- |
| **최적화 전** (memo·useCallback 없음) | `👪 [MovieSearch] render` 1회 | `🎬 [MovieCard] render` **카드 수만큼** (예: 20회) ❌ |
| **최적화 후** (memo + useCallback) | `👪 [MovieSearch] render` 1회 | `🎬 [MovieCard] render` **0회** ✅ |

- 부모는 `title` state가 바뀌므로 어느 경우든 리렌더된다(정상).
- 핵심은 **목록이 바뀌지 않았는데 자식 카드가 다시 그려지지 않는 것**.
  `movie` prop은 `useMemo`로 안정적인 배열에서 오고, `onSelect`는 `useCallback`으로 참조가 고정되어
  `memo`의 얕은 비교를 통과 → 카드 렌더가 생략된다.
- 새로 **검색을 실행**하면 `movies`가 바뀌어 `useMemo`가 재계산되고 카드들이 정상적으로 렌더된다.

> 참고: `main.tsx`가 `StrictMode`라 개발 모드에서는 초기 렌더 로그가 의도적으로 2번씩 찍힐 수 있습니다(프로덕션 빌드에는 영향 없음). 타이핑 시 카드 로그가 사라지는지로 최적화 효과를 확인하세요.
