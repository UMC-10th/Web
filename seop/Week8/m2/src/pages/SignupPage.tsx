import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signup } from '../apis/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { useAuth } from '../context/AuthContext';

const emailSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
});

const passwordSchema = z.object({
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

const nameSchema = z.object({
  name: z.string().min(1, '닉네임을 입력해주세요.'),
});

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;
type NameForm = z.infer<typeof nameSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isValid: isEmailValid },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isValid: isPasswordValid },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });

  const {
    register: registerName,
    handleSubmit: handleNameSubmit,
    formState: { isValid: isNameValid },
  } = useForm<NameForm>({
    resolver: zodResolver(nameSchema),
    mode: 'onChange',
  });

  const onEmailSubmit = (data: EmailForm) => {
    setEmail(data.email);
    setStep(2);
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    setPassword(data.password);
    setStep(3);
  };

  const onNameSubmit = async (data: NameForm) => {
    try {
      const response = await signup({ email, password, name: data.name });
      setAccessToken(response.data?.accessToken);
      setRefreshToken(response.data?.refreshToken);
      await refetchUser();
      navigate('/');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
      <h1 className="text-2xl font-bold">회원가입</h1>

      {/* Step 1 - 이메일 */}
      {step === 1 && (
        <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="flex flex-col gap-3 w-[300px]">
          <div>
            <input
              {...registerEmail('email')}
              type="text"
              placeholder="이메일"
              className="border border-gray-300 w-full p-[10px] rounded-sm focus:border-blue-400"
            />
            {emailErrors.email && (
              <p className="text-red-500 text-sm mt-1">{emailErrors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={!isEmailValid}
            className={`w-full py-3 rounded font-semibold transition ${
              isEmailValid
                ? 'bg-blue-400 text-white hover:bg-blue-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            다음
          </button>
        </form>
      )}

      {/* Step 2 - 비밀번호 */}
      {step === 2 && (
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="flex flex-col gap-3 w-[300px]">
          <p className="text-gray-600 text-sm">✉️ {email}</p>
          <div>
            <div className="relative">
              <input
                {...registerPassword('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호"
                className="border border-gray-300 w-full p-[10px] rounded-sm focus:border-blue-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
            {passwordErrors.password && (
              <p className="text-red-500 text-sm mt-1">{passwordErrors.password.message}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <input
                {...registerPassword('passwordConfirm')}
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="비밀번호 확인"
                className="border border-gray-300 w-full p-[10px] rounded-sm focus:border-blue-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPasswordConfirm ? '👁️' : '🙈'}
              </button>
            </div>
            {passwordErrors.passwordConfirm && (
              <p className="text-red-500 text-sm mt-1">{passwordErrors.passwordConfirm.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={!isPasswordValid}
            className={`w-full py-3 rounded font-semibold transition ${
              isPasswordValid
                ? 'bg-blue-400 text-white hover:bg-blue-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            다음
          </button>
        </form>
      )}

      {/* Step 3 - 닉네임 */}
      {step === 3 && (
        <form onSubmit={handleNameSubmit(onNameSubmit)} className="flex flex-col gap-3 w-[300px]">
          <div className="flex justify-center mb-2">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
          </div>
          <div>
            <input
              {...registerName('name')}
              type="text"
              placeholder="닉네임"
              className="border border-gray-300 w-full p-[10px] rounded-sm focus:border-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={!isNameValid}
            className={`w-full py-3 rounded font-semibold transition ${
              isNameValid
                ? 'bg-blue-400 text-white hover:bg-blue-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            회원가입 완료
          </button>
        </form>
      )}
    </div>
  );
}