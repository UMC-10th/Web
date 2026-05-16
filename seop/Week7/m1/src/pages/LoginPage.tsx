import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { signin } from '../apis/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: signin,
    onSuccess: async (response) => {
      const responseData = typeof response === 'string' ? JSON.parse(response) : response;
      setAccessToken(responseData?.data?.accessToken);
      setRefreshToken(responseData?.data?.refreshToken);
      await refetchUser();
      navigate('/');
    },
    onError: () => {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    },
  });

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/v1/auth/google/login';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <form onSubmit={handleSubmit((data) => mutate(data))} className="flex flex-col gap-3 w-[400px]">
        <input
          {...register('email')}
          type="text"
          placeholder="이메일"
          className="border border-gray-300 w-full p-3 rounded text-base focus:outline-none focus:border-blue-400"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        <input
          {...register('password')}
          type="password"
          placeholder="비밀번호"
          className="border border-gray-300 w-full p-3 rounded text-base focus:outline-none focus:border-blue-400"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        <button
          type="submit"
          disabled={!isValid || isPending}
          className={`w-full py-3 rounded text-base font-semibold transition ${
            isValid && !isPending
              ? 'bg-gray-400 text-white hover:bg-gray-500'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isPending ? '로그인 중...' : '로그인'}
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <img src="/images/google.svg" alt="google" className="w-5 h-5" />
          구글 로그인
        </button>
      </form>
    </div>
  );
}