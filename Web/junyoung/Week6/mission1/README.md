# Week6 Mission 1

TanStack Query의 `useQuery`로 LP 목록/상세 화면을 구현한 미션입니다.

## 구현 내용

- `QueryClientProvider`와 기본 캐시 정책 설정
- LP 목록 요청을 `useQuery({ queryKey: ['lps', sort] })`로 구성
- 최신순/오래된순 정렬 값을 `queryKey`에 포함해 정렬 변경 시 자동 리패치
- LP 상세 요청을 `useQuery({ queryKey: ['lp', lpid] })`로 구성
- 목록 카드 hover 오버레이와 상세 페이지 라우팅
- 로그인 여부에 따른 헤더 UI와 상세 페이지 보호 라우트
- 목록/상세 로딩 UI와 재시도 가능한 에러 UI

## 실행 방법

```bash
npm install
npm run dev
```

API 서버가 연결되지 않은 환경에서도 화면을 확인할 수 있도록 LP 목록/상세 요청 실패 시 샘플 데이터를 보여줍니다.
