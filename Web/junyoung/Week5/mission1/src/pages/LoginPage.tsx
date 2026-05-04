import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { loginSchema, type LoginFormData } from '../schemas/loginSchema';
import { setAuthTokens } from '../utils/auth';

const GOOGLE_LOGIN_URL = 'http://localhost:8000/v1/auth/google/login';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/';
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { data: res } = await axios.post(
        'http://localhost:8000/v1/auth/signin',
        { email: data.email, password: data.password }
      );
      const { accessToken, refreshToken } = res.data;
      setAuthTokens({ accessToken, refreshToken });
      navigate(from, { replace: true });
    } catch {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] px-4 -mt-16">
      <div className="w-full max-w-xs flex flex-col gap-6">
        {/* 뒤로가기 + 타이틀 */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 text-gray-400 hover:text-white text-lg font-bold"
          >
            &lt;
          </button>
          <h1 className="text-white text-lg font-bold">로그인</h1>
        </div>

        {from !== '/' && (
          <div className="rounded-md border border-pink-500/30 bg-pink-500/10 px-4 py-3 text-sm leading-6 text-pink-100">
            인증이 필요한 페이지입니다. 로그인 후 요청한 페이지로 이동합니다.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* 구글 로그인 버튼 */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full relative flex items-center border border-gray-600 bg-transparent text-white font-medium text-sm px-4 rounded-md hover:border-gray-400 transition-colors"
            style={{ height: '40px' }}
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2">구글 로그인</span>
          </button>

          {/* OR 구분선 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-gray-500 text-xs">OR</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* 이메일 */}
          <div className="flex flex-col gap-1">
            <input
              {...register('email')}
              type="email"
              placeholder="이메일을 입력해주세요!"
              className="bg-transparent border border-gray-600 text-white text-sm px-4 rounded-md outline-none placeholder-gray-500 focus:border-pink-500 transition-colors"
              style={{ height: '40px' }}
            />
            {errors.email && (
              <p className="text-pink-500 text-xs px-1">{errors.email.message}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-1">
            <input
              {...register('password')}
              type="password"
              placeholder="비밀번호를 입력해주세요!"
              className="bg-transparent border border-gray-600 text-white text-sm px-4 rounded-md outline-none placeholder-gray-500 focus:border-pink-500 transition-colors"
              style={{ height: '40px' }}
            />
            {errors.password && (
              <p className="text-pink-500 text-xs px-1">{errors.password.message}</p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!isValid}
            className="rounded-md text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 disabled:bg-[#2a2a2a] disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            style={{ height: '40px' }}
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
