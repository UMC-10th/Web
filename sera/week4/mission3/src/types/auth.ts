// 회원가입 폼 전체 데이터 타입
export interface SignupFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
}

// 로그인 폼 데이터 타입
export interface LoginFormData {
  email: string;
  password: string;
}

// 서버 응답 토큰 타입
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
