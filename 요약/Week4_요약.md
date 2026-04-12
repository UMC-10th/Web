# Week 4 작업 요약

## 📁 경로
`Web/junyoung/Week4/`

---

## 📌 무엇을 만드나?
**사용자 인증(Authentication) & 인가(Authorization)** 기능을 갖춘 앱

Custom Hook + react-hook-form + 백엔드 서버 연동으로 총 2단계 미션:

| 단계 | 내용 |
|------|------|
| 미션 1 | Custom Hook(`useCustomFetch`)으로 영화 데이터 패칭 일원화 |
| 미션 2 | `useForm` 커스텀 훅 + 유효성 검증 + 서버 연동 로그인 구현 |
| 미션 3 | `react-hook-form` + `Zod`로 다단계 회원가입 폼 구현 |

---

## 🔐 인증(Authentication) vs 인가(Authorization)

| 구분 | 인증 (Authentication) | 인가 (Authorization) |
|------|----------------------|---------------------|
| 질문 | 너는 누구니? | 너는 무엇을 할 수 있니? |
| 순서 | 항상 먼저 수행됨 | 인증이 끝난 후 수행됨 |
| 목적 | 사용자의 신원 확인 | 권한을 확인하여 접근 제어 |
| 실패 시 응답 | `401 Unauthorized` | `403 Forbidden` |
| 예시 | 로그인 화면에서 ID/PW 확인 | 관리자 페이지 접근 권한 체크 |

### 인증 방법 예시
1. **아이디 + 비밀번호** - 가장 기본적인 방식
2. **소셜 로그인(OAuth)** - 구글, 깃허브 등 외부 서비스로 신원 보증
3. **2단계 인증(2FA/MFA)** - OTP, 문자, 이메일 추가 인증
4. **생체인증** - 지문, 얼굴 인식

### 흐름
```
사용자 요청 → 인증(Authentication) → 실패 시 401
                         ↓ 성공
              인가(Authorization) → 실패 시 403
                         ↓ 권한 있음
              정상 처리 (리소스 접근)
```

---

## 🪙 JWT vs 세션(Session)

### JWT (JSON Web Token)
- 로그인 성공 시 서버가 **서명된 토큰(AccessToken)** 발급
- 클라이언트는 모든 API 요청에 헤더에 토큰 포함:
  ```
  Authorization: Bearer <AccessToken>
  ```
- 서버는 토큰 내 정보(서명, 만료 시간)만 확인 → **무상태(stateless)**

| 장점 | 단점 |
|------|------|
| 서버 확장성 좋음(스케일 아웃) | 토큰 유출 시 만료 전까지 사용 가능 |
| 마이크로서비스 환경에 적합 | 즉시 무효화 어려움 |
| 웹/모바일 등 다양한 클라이언트 지원 | 보안 설계 필요 |

### 세션(Session)
- 로그인 성공 시 서버가 **세션 ID** 생성 후 저장소(메모리, Redis)에 저장
- 클라이언트 브라우저에 세션 ID가 **쿠키**로 내려옴
- 이후 요청마다 쿠키가 자동 전송 → 서버가 세션 저장소에서 확인
- **상태(state)를 서버가 직접 관리**하는 방식

```tsx
// axios 사용 시 쿠키 포함 옵션 필요
axios.get("http://localhost:4000/user", {
  withCredentials: true,
});
```

| 장점 | 단점 |
|------|------|
| 서버에서 즉시 강제 로그아웃 가능 | 서버 확장 시 세션 동기화 필요 |
| 쿠키 자동 전송으로 편리 | CSRF 공격 취약 |
| 안정적이고 검증된 방식 | 스케일 아웃에 불리 |

---

## 🪙 Access Token vs Refresh Token

| | Access Token | Refresh Token |
|--|------------|--------------|
| 역할 | API 요청 시 인증/인가 확인 | AccessToken 만료 시 재발급용 |
| 수명 | 짧음 (15분~30분) | 김 (7일~30일) |
| 저장 | 메모리 또는 localStorage | HttpOnly 쿠키 (권장) |

### 토큰 재발급 흐름
1. 클라이언트 → 서버: API 요청 (AccessToken)
2. 서버 → 클라이언트: `401 Unauthorized` (만료됨)
3. 클라이언트 → 서버: RefreshToken으로 새 AccessToken 요청
4. 서버 → 클라이언트: 새 AccessToken + 새 RefreshToken
5. 클라이언트: 새 토큰 저장 후 원래 요청 재시도
> React에서는 **axios interceptor**로 이 흐름을 자동화

---

## 💾 클라이언트 저장소 전략

| 저장소 | 자동 전송 | 수명 | XSS 취약 | CSRF 취약 | 활용 예시 |
|--------|---------|------|----------|----------|---------|
| **쿠키** | ✅ (자동) | 설정 가능 | ❌ (HttpOnly 시 방어) | ✅ | RefreshToken |
| **localStorage** | ❌ (수동) | 영구적 | ✅ | ❌ | AccessToken |
| **sessionStorage** | ❌ (수동) | 탭 종료 시 삭제 | ✅ | ❌ | 임시 세션 |

### 쿠키 보안 옵션
- `HttpOnly`: JS에서 접근 불가 → XSS 방어
- `Secure`: HTTPS에서만 전송 → 도청 방지
- `SameSite`: 크로스 도메인 전송 제어
  - `Strict`: 같은 사이트만 (보안 ↑, UX ↓)
  - `Lax`: 대부분 안전, 기본 추천
  - `None; Secure`: 크로스 도메인 허용 (HTTPS 필수)

---

## 🪝 Custom Hook

### 왜 사용하나?
1. **코드 중복 제거** - 여러 컴포넌트에서 쓰는 로직을 한 곳에
2. **관심사 분리** - UI(컴포넌트)와 비즈니스 로직 분리
3. **유지보수 용이** - 로직 수정 시 한 파일만 고치면 됨
4. **테스트 용이** - UI 없이 로직만 독립적으로 테스트 가능

### 기본 문법
```tsx
// src/hooks/useToggle.ts
import { useState } from "react";

function useToggle(initialValue: boolean = false) {
  const [state, setState] = useState(initialValue);

  const toggle = () => setState((prev) => !prev);

  return [state, toggle] as const;
}

export default useToggle;
```

### 사용법
```tsx
import useToggle from "../hooks/useToggle";

const ToggleExample = () => {
  const [isOpen, toggle] = useToggle(false);

  return (
    <div>
      <h1>{isOpen ? "열림" : "닫힘"}</h1>
      <button onClick={toggle}>토글</button>
    </div>
  );
};
```

### 파일 구조
```
src/
├── hooks/
│   ├── useCustomFetch.ts   // 데이터 요청/취소/에러 관리
│   ├── useToggle.ts        // 토글 상태 관리
│   ├── useLocalStorage.ts  // 웹 스토리지 동기화
│   ├── useDebounce.ts      // 입력 지연 처리
│   └── useAuth.ts          // 로그인/토큰/프로필 상태
```

> Custom Hook 이름은 반드시 `use`로 시작 (리액트 규칙)

---

## 🎬 미션 1 – `useCustomFetch` 커스텀 훅

### 목표
Week3에서 만든 영화 페이지의 데이터 패칭 로직을 Custom Hook으로 일원화

### 구현 구조
```tsx
// src/hooks/useCustomFetch.ts
import { useState, useEffect } from "react";
import axios from "axios";

function useCustomFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.get<T>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          },
        });
        setData(data);
      } catch {
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);  // url이 바뀌면 자동으로 재요청

  return { data, isLoading, error };
}

export default useCustomFetch;
```

### 페이지에서 사용
```tsx
// MoviesPage.tsx
const { data, isLoading, error } = useCustomFetch<MovieResponse>(
  `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`
);
```

### 체크리스트
- [ ] `useCustomFetch` 훅 생성 (data, isLoading, error 반환)
- [ ] URL 변경 시 자동 재요청 (의존성 배열에 URL 포함)
- [ ] 로딩 스피너 표시
- [ ] 에러 메시지 표시
- [ ] 영화 목록 페이지에 적용
- [ ] 영화 상세 페이지에 적용

---

## 🔑 미션 2 – 로그인 기능 구현

### 목표
`useForm` 커스텀 훅 직접 구현 + 유효성 검사 + 백엔드 서버 연동

### 백엔드 서버 설정
NestJS 기반 로컬 서버를 클론하여 실행:
```bash
# 서버 실행 순서
pnpm install
prisma db push      # 스키마 DB 반영
pnpm db:seed        # 가상 데이터 삽입
pnpm run start:dev  # 개발 서버 실행 (기본 포트 3000)
```

`.env` 파일 필수 설정:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET=...
JWT_EXPIRES_IN=3600s
REFRESH_JWT_SECRET=...
REFRESH_JWT_EXPIRES_IN=7d
```

### Swagger 활용
서버 실행 후 `http://localhost:3000/api` 에서 API 문서 확인 가능

### 로그인 UI 구현
```tsx
// LoginPage.tsx 핵심 구조
const LoginPage = () => {
  const navigate = useNavigate();
  const { values, errors, onChange, validate } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const { data } = await axios.post("http://localhost:3000/v1/auth/login", values);
    localStorage.setItem("accessToken", data.accessToken);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={values.email} onChange={onChange("email")} />
      {errors.email && <p>{errors.email}</p>}
      <input type="password" value={values.password} onChange={onChange("password")} />
      {errors.password && <p>{errors.password}</p>}
      <button type="submit">로그인</button>
    </form>
  );
};
```

### 유효성 검사 규칙
| 필드 | 규칙 |
|------|------|
| 이메일 | 비어있지 않음, 이메일 형식 |
| 비밀번호 | 비어있지 않음, 최소 8자, 특수문자 포함 |

### 체크리스트
- [ ] 로그인 UI 구현 (폼, 입력 필드, 버튼)
- [ ] 뒤로 가기 버튼 (`useNavigate(-1)`)
- [ ] 이메일/비밀번호 유효성 검사 (실시간 에러 표시)
- [ ] 로그인 성공 시 AccessToken 저장 후 홈으로 이동
- [ ] 로그인 실패 시 에러 메시지 표시

---

## 🗝️ 핵심 개념 정리

| 개념 | 설명 |
|------|------|
| **인증(Authentication)** | "누구인지" 확인 → 401 |
| **인가(Authorization)** | "무엇을 할 수 있는지" 결정 → 403 |
| **JWT** | 무상태(stateless) 토큰 방식 |
| **세션(Session)** | 서버가 상태를 직접 관리하는 방식 |
| **AccessToken** | 짧은 수명, API 인증용 |
| **RefreshToken** | 긴 수명, AccessToken 재발급용 |
| **HttpOnly 쿠키** | JS 접근 불가 → XSS 방어 |
| **SameSite 쿠키** | 크로스 도메인 제어 → CSRF 방어 |
| **Custom Hook** | `use`로 시작, 재사용 가능한 훅 로직 |
| **XSS** | 악성 스크립트 삽입 공격 → localStorage 취약 |
| **CSRF** | 크로스 사이트 요청 위조 → 쿠키 자동 전송 취약 |

---

---

## 📝 미션 3 – 회원가입 기능 구현 (react-hook-form + Zod)

### 목표
다단계 폼으로 회원가입 구현 + `react-hook-form` + `Zod`로 강력한 유효성 검사

### 회원가입 단계 (3단계)

#### Step 1 – 이메일 입력
- 라우터에 `/signup` 경로 추가
- 이메일 유효성 검사: 형식이 올바르지 않으면 에러 메시지 표시
- '다음' 버튼: 유효성 통과 시에만 활성화

#### Step 2 – 비밀번호 설정
- 이전 단계(이메일)가 상단에 표시된 채 비밀번호 입력 단계로 전환
- 비밀번호 길이 검사 (최소 6자 이상)
- 비밀번호 가시성 토글 (`useToggle` 활용 → 눈 아이콘 클릭)
- 비밀번호 재확인: 불일치 시 "비밀번호가 일치하지 않습니다." 에러 표시
- '다음' 버튼: 비밀번호 유효 + 일치 시에만 활성화

#### Step 3 – 닉네임 입력 & 완료
- 닉네임 입력 필드
- 프로필 이미지 UI (선택 사항, 실제 업로드 기능은 미구현)
- '회원가입 완료' 클릭 → 서버 POST 요청 → 성공 시 홈으로 이동

### react-hook-form

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("올바른 이메일 형식을 입력해주세요."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
  passwordConfirm: z.string(),
  nickname: z.string().min(1, "닉네임을 입력해주세요."),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["passwordConfirm"],
});

type SignupForm = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SignupForm) => {
    await axios.post("http://localhost:3000/v1/auth/signup", data);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} type="email" />
      {errors.email && <p>{errors.email.message}</p>}
      <button type="submit" disabled={!isValid}>회원가입 완료</button>
    </form>
  );
};
```

### Zod 핵심 개념

| 메서드 | 용도 |
|--------|------|
| `z.object({})` | 객체 스키마 정의 |
| `z.string()` | 문자열 타입 |
| `.email()` | 이메일 형식 검사 |
| `.min(n)` | 최소 길이 검사 |
| `.refine()` | 커스텀 유효성 검사 (비밀번호 일치 등) |
| `z.infer<typeof schema>` | 스키마에서 TypeScript 타입 자동 추출 |

### react-hook-form 주요 API

| API | 설명 |
|-----|------|
| `register("fieldName")` | 입력 필드 등록 |
| `handleSubmit(fn)` | 폼 제출 핸들러 (유효성 통과 후 실행) |
| `formState.errors` | 각 필드별 에러 객체 |
| `formState.isValid` | 전체 폼 유효성 여부 (버튼 활성화에 활용) |
| `watch("fieldName")` | 특정 필드 값 실시간 감시 |
| `zodResolver(schema)` | Zod 스키마를 resolver로 연결 |

### 체크리스트
- [ ] `/signup` 라우터 연결
- [ ] Step 1: 이메일 유효성 검사 + 다음 버튼 조건부 활성화
- [ ] Step 2: 비밀번호 길이 검사 + 가시성 토글 + 비밀번호 확인
- [ ] Step 3: 닉네임 입력 + 회원가입 완료 → 홈 이동
- [ ] `react-hook-form` + `Zod` 연동
- [ ] TypeScript 타입 정의 (`z.infer` 활용)
- [ ] `useLocalStorage` 훅으로 토큰 저장 관리

---

## 🔄 전체 흐름 요약

### 미션 1 흐름
```
useCustomFetch(url)
  → axios.get(url) with Bearer token
  → data, isLoading, error 반환
  → MoviesPage / MovieDetailPage에서 사용
```

### 미션 2 흐름
```
사용자 입력 (이메일 + 비밀번호)
  → useForm으로 상태 관리 + 유효성 검사
  → 서버 POST /v1/auth/login
  → AccessToken 응답 수신
  → localStorage 저장
  → 홈 페이지로 이동
```

### 미션 3 흐름
```
Step 1: 이메일 입력 + 유효성 검사
  ↓ '다음' 클릭
Step 2: 비밀번호 입력 + 확인 + 가시성 토글
  ↓ '다음' 클릭
Step 3: 닉네임 입력 + 프로필 이미지 UI
  ↓ '회원가입 완료' 클릭
서버 POST /v1/auth/signup
  → 성공 시 홈 이동
  → Zod 스키마로 유효성, react-hook-form으로 폼 상태 관리
```
