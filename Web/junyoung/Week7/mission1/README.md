# Week7 Mission 1

TanStack Query의 `useMutation`으로 LP, 댓글, 인증, 프로필 변경 작업을 구현한 미션입니다.

## 구현 내용

- `QueryClientProvider`와 기본 캐시 정책 설정
- Query Key Factory로 LP 목록/상세, 댓글, 사용자 정보 키 관리
- 목록 카드 hover 오버레이와 상세 페이지 라우팅
- 로그인 여부에 따른 헤더 UI와 상세 페이지 보호 라우트
- 목록/상세 로딩 UI와 재시도 가능한 에러 UI
- 우측 하단 `+` 버튼 LP 작성 모달, 파일 입력, 태그 추가/삭제
- LP 생성/수정/삭제 성공 후 관련 query invalidate
- 댓글 생성/수정/삭제 성공 후 댓글 목록 invalidate
- 로그인, 로그아웃, 탈퇴를 `useMutation`으로 처리
- 마이페이지 프로필 수정 기능 구현

## 실행 방법

```bash
npm install
npm run dev
```

API 서버가 연결되지 않은 환경에서도 화면을 확인할 수 있도록 LP 목록/상세 요청 실패 시 샘플 데이터를 보여줍니다.
