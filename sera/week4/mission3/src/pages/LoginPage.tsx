import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schemas/authSchema';
import useLocalStorage from '../hooks/useLocalStorage';
import type { AuthTokens } from '../types/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setValue: setTokens } = useLocalStorage<AuthTokens | null>('tokens', null);

  // react-hook-form + Zod 연동
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // 입력할 때마다 실시간 유효성 검사
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch('http://localhost:8000/v1/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!res.ok) throw new Error('로그인 실패');

      const tokens = (await res.json()) as AuthTokens;
      // 토큰을 localStorage에 저장
      setTokens(tokens);
      navigate('/');
    } catch {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* 헤더: 뒤로가기 + 타이틀 */}
        <div className="flex items-center mb-8 relative">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-lg absolute left-0 hover:text-gray-300 transition"
          >
            &lt;
          </button>
          <h1 className="text-white text-xl font-bold w-full text-center">로그인</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* 구글 로그인 버튼 */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-600 rounded-lg px-4 py-3 text-white hover:bg-gray-900 transition"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            구글 로그인
          </button>

          {/* OR 구분선 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-600" />
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-600" />
          </div>

          {/* 이메일 입력 */}
          <div className="flex flex-col gap-1">
            <input
              {...register('email')}
              type="text"
              placeholder="이메일을 입력해주세요!"
              className="w-full bg-black text-white placeholder-gray-600 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-gray-400"
            />
            {errors.email && (
              <p className="text-pink-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div className="flex flex-col gap-1">
            <input
              {...register('password')}
              type="password"
              placeholder="비밀번호를 입력해주세요!"
              className="w-full bg-black text-white placeholder-gray-600 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-gray-400"
            />
            {errors.password && (
              <p className="text-pink-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* 로그인 버튼: isValid일 때만 활성화 */}
          <button
            type="submit"
            disabled={!isValid}
            className="w-full py-3 rounded-lg font-bold text-white transition
              disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed
              enabled:bg-pink-500 enabled:hover:bg-pink-600"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
