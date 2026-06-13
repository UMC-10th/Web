# 🚀 성능 최적화 정리 (React.memo / useCallback / useMemo)

> React DevTools **Profiler 탭**으로 리렌더를 관찰하고, 불필요한 상위/하위 리렌더를
> `memo` · `useCallback` · `useMemo`로 제거한 과정을 정리한 문서입니다.

## 0. Profiler로 무엇을 보나

1. Chrome 웹스토어에서 **React Developer Tools** 설치 → 개발 모드(`npm run dev`)로 앱 실행.
2. DevTools → **⚛️ Profiler** 탭 → 좌상단 **● Record** 클릭.
3. 영화 검색 / 필터링(검색어 타이핑, 언어 변경 등)을 수행 → **Stop**.
4. **Flamegraph / Ranked** 차트에서 *회색(렌더 안 됨)* vs *색칠(리렌더됨)* 을 확인.
   - 설정 ⚙️ → **"Highlight updates when components render"** 를 켜면 화면에서도 리렌더된 컴포넌트에 테두리가 깜빡인다.

관찰 포인트: **목록 데이터가 안 바뀌었는데도 영화 카드들이 리렌더되는가?**

---

## 1. TMDB 영화 검색 — 최적화 전 / 후

### 문제 (최적화 전)

검색창에 글자 하나를 타이핑 → 부모 `MovieSearch`의 `title` state 변경 → 부모 리렌더.
이때 아래 두 가지 때문에 **목록이 그대로인데도 모든 `MovieCard`가 같이 리렌더**된다.

- `MovieCard`가 일반 컴포넌트라 부모가 렌더되면 무조건 자식도 렌더.
- 카드에 넘기는 `onSelect`가 **인라인 화살표 함수**라 매 렌더마다 새 참조.
- 정렬된 배열을 **렌더마다 새로 `sort()`** → 새 배열 참조.

### 해결 (최적화 후)

| 훅 | 위치 | 역할 |
| --- | --- | --- |
| `memo` | `MovieCard.tsx` | `movie`·`onSelect` props가 얕은 비교로 같으면 리렌더 건너뜀 |
| `useCallback` | `MovieSearch.tsx` `handleSelect`, `handleCloseModal` (deps `[]`) | memo된 카드에 넘기는 핸들러 참조 고정 → memo 유지 |
| `useMemo` | `MovieSearch.tsx` `sortedMovies` (deps `[movies]`) | 평점순 정렬을 `movies` 변경 시에만 재계산 + 안정적 배열 참조 |

> `handleSubmit`은 form에서만 쓰고 자식에게 안 넘기므로 일부러 `useCallback`을 쓰지 않았다(효과 없음).

### 콘솔 로그로 본 차이 (Profiler의 대용 증거)

검색 결과 20개가 떠 있는 상태에서 **검색창에 글자 1개 입력** 시:

| 구분 | `👪 MovieSearch` | `🎬 MovieCard` |
| --- | --- | --- |
| 최적화 전 | 1회 | **20회** ❌ |
| 최적화 후 | 1회 | **0회** ✅ |

- 부모는 입력 state가 바뀌므로 어느 쪽이든 1회 렌더(정상).
- 핵심은 **목록 미변경 시 카드 리렌더가 0회**가 된 것. Profiler Flamegraph에서도 카드들이 회색(렌더 안 됨)으로 표시된다.
- 새로 **검색을 실행**하면 `movies`가 바뀌어 `useMemo` 재계산 + 카드 정상 렌더 → 의도대로 동작.

**결론:** 현재 TMDB 앱은 상위 전체가 불필요하게 리렌더되는 구간이 없다(이미 최적화 완료 상태).

---

## 2. LP 사이트 성능 개선 포인트 (3개 이상)

> 현재 LP 프로젝트(`UMC-10th-mission-FE`)는 새 미션을 위해 working tree에서 제거된 상태라,
> 아래는 git 기록의 실제 코드(`LPListPage.tsx`, `CommentSection.tsx`)를 기준으로 한 개선안이다.
> 프로젝트를 복구(`git restore`)하면 그대로 적용 가능.

### ① LP 카드를 별도 컴포넌트로 분리 + `React.memo`

**문제:** `LPListPage`에서 카드를 인라인 `<div>`로 `.map()` 렌더 중. 정렬 토글(`setSort`)이나
다음 페이지 로드(`isFetchingNextPage`) 등으로 페이지가 리렌더되면 **기존 카드 전부가 다시 렌더**된다.

```tsx
// components/LpCard.tsx (신규)
import { memo } from "react";
import type { Lp } from "../types/lp";

interface LpCardProps {
  lp: Lp;
  onClick: (id: number) => void; // 인라인 navigate 대신 id만 받는 안정적 핸들러
}

function LpCardBase({ lp, onClick }: LpCardProps) {
  return (
    <div onClick={() => onClick(lp.id)} className="...">
      {/* 기존 카드 마크업 */}
    </div>
  );
}
export default memo(LpCardBase); // props 같으면 리렌더 skip
```

### ② 카드 클릭 핸들러를 `useCallback`으로 고정

**문제:** 기존엔 카드마다 `onClick={() => navigate(`/lps/${lp.id}`)}` 인라인 함수 → memo를 무력화.

```tsx
// LPListPage.tsx
const handleCardClick = useCallback(
  (id: number) => navigate(`/lps/${id}`),
  [navigate]
);
// ...
{lpList.map((lp) => <LpCard key={lp.id} lp={lp} onClick={handleCardClick} />)}
```

→ ①+② 조합으로, 정렬 토글/추가 로딩 시 **새로 들어온 카드만 렌더**되고 기존 카드는 skip.

### ③ `flatMap` 결과를 `useMemo`로 메모이제이션

**문제:** `const lpList = data?.pages.flatMap(...) || []` 가 **렌더마다 새 배열** 생성 →
하위에 넘기면 참조가 매번 달라져 memo가 깨진다.

```tsx
const lpList = useMemo(
  () => data?.pages.flatMap((page) => page.data.data) ?? [],
  [data]
);
```

### ④ (보너스) CommentSection 댓글 항목 분리 + memo

**문제:** `CommentSection`은 `commentText`(입력창), `openMenuId`, `editingId` 등 state가 많아
**댓글을 한 글자 타이핑할 때마다 댓글 리스트 전체가 리렌더**된다.

```tsx
// 댓글 한 개를 CommentItem으로 분리하고 memo로 감싼다.
const CommentItem = memo(function CommentItem({ comment, myId, onEdit, onDelete }) { ... });
// 부모에서 onEdit/onDelete는 useCallback으로 고정.
```

→ 입력창 타이핑 시 입력 영역만 리렌더되고, 기존 댓글들은 Profiler에서 회색(skip)으로 유지.

---

## 적용한 최적화 요약 (한 줄)

- **TMDB**: `MovieCard`(memo) + `handleSelect/handleCloseModal`(useCallback) + `sortedMovies`(useMemo)
  → 타이핑 시 카드 리렌더 20회 → 0회.
- **LP**: 카드/댓글 컴포넌트 분리 후 `memo`, 클릭·수정·삭제 핸들러 `useCallback`, 목록 배열 `useMemo`
  → 정렬 토글·추가 로딩·댓글 입력 시 기존 항목 리렌더 제거.
