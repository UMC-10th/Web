import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signin } from '../apis/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
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

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await signin(data);
      setAccessToken(response.data?.accessToken);
      setRefreshToken(response.data?.refreshToken);
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm px-4">
          <div className="flex items-center mb-8">
            <button onClick={() => navigate(-1)} className="text-white text-xl mr-4">
              &lt;
            </button>
            <h1 className="text-white text-xl font-semibold flex-1 text-center mr-6">로그인</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-3 border border-gray-600 rounded px-4 py-3 text-white hover:bg-gray-800 transition"
            >
              <img src="https://www.google.com/favicon.ico" alt="google" className="w-5 h-5" />
              구글 로그인
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-600" />
              <span className="text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-600" />
            </div>

            <div>
              <input
                {...register('email')}
                type="text"
                placeholder="이메일을 입력해주세요!"
                className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
              />
              {errors.email && (
                <p className="text-pink-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                {...register('password')}
                type="password"
                placeholder="비밀번호를 입력해주세요!"
                className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
              />
              {errors.password && (
                <p className="text-pink-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-3 rounded font-semibold transition ${
                isValid
                  ? 'bg-pink-500 text-white hover:bg-pink-600'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}