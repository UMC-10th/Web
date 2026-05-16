import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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

  const onSubmit = async (data: LoginForm) => {
  try {
    const response = await signin(data);
    const responseData = typeof response === 'string' ? JSON.parse(response) : response;
    console.log('responseData:', responseData);
    console.log('accessToken:', responseData?.data?.accessToken);
    setAccessToken(responseData?.data?.accessToken);
    setRefreshToken(responseData?.data?.refreshToken);
    await refetchUser();
    navigate('/');
  } catch (error) {
    console.error('로그인 실패:', error);
    alert('이메일 또는 비밀번호가 올바르지 않습니다.');
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
      <h1 className="text-2xl font-bold">로그인</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-[300px]">
        <div>
          <input
            {...register('email')}
            type="text"
            placeholder="이메일"
            className="border border-gray-300 w-full p-[10px] rounded-sm focus:border-blue-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            {...register('password')}
            type="password"
            placeholder="비밀번호"
            className="border border-gray-300 w-full p-[10px] rounded-sm focus:border-blue-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 rounded font-semibold transition ${
            isValid
              ? 'bg-blue-400 text-white hover:bg-blue-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          로그인
        </button>
      </form>
    </div>
  );
}