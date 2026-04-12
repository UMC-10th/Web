import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signup } from '../apis/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';

// Step 1 스키마
const emailSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
});

// Step 2 스키마
const passwordSchema = z.object({
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

// Step 3 스키마
const nameSchema = z.object({
  name: z.string().min(1, '닉네임을 입력해주세요.'),
});

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;
type NameForm = z.infer<typeof nameSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  // Step 1 폼
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isValid: isEmailValid },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
  });

  // Step 2 폼
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isValid: isPasswordValid },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });

  // Step 3 폼
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
      navigate('/');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm px-4">

          {/* Step 1 - 이메일 */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="flex flex-col gap-4">
              <div className="flex items-center mb-4">
                <button type="button" onClick={() => navigate(-1)} className="text-white text-xl mr-4">
                  &lt;
                </button>
                <h1 className="text-white text-xl font-semibold flex-1 text-center mr-6">회원가입</h1>
              </div>

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
                  {...registerEmail('email')}
                  type="text"
                  placeholder="이메일을 입력해주세요!"
                  className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                />
                {emailErrors.email && (
                  <p className="text-pink-500 text-sm mt-1">{emailErrors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isEmailValid}
                className={`w-full py-3 rounded font-semibold transition ${
                  isEmailValid
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                다음
              </button>
            </form>
          )}

          {/* Step 2 - 비밀번호 */}
          {step === 2 && (
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="flex flex-col gap-4">
              <div className="flex items-center mb-4">
                <button type="button" onClick={() => setStep(1)} className="text-white text-xl mr-4">
                  &lt;
                </button>
                <h1 className="text-white text-xl font-semibold flex-1 text-center mr-6">회원가입</h1>
              </div>

              {/* 이메일 표시 */}
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <span>✉️</span>
                <span>{email}</span>
              </div>

              {/* 비밀번호 */}
              <div>
                <div className="relative">
                  <input
                    {...registerPassword('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력해주세요!"
                    className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 pr-10"
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
                  <p className="text-pink-500 text-sm mt-1">{passwordErrors.password.message}</p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <div className="relative">
                  <input
                    {...registerPassword('passwordConfirm')}
                    type={showPasswordConfirm ? 'text' : 'password'}
                    placeholder="비밀번호를 다시 한 번 입력해주세요!"
                    className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 pr-10"
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
                  <p className="text-pink-500 text-sm mt-1">{passwordErrors.passwordConfirm.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isPasswordValid}
                className={`w-full py-3 rounded font-semibold transition ${
                  isPasswordValid
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                다음
              </button>
            </form>
          )}

          {/* Step 3 - 닉네임 */}
          {step === 3 && (
            <form onSubmit={handleNameSubmit(onNameSubmit)} className="flex flex-col gap-4">
              <div className="flex items-center mb-4">
                <button type="button" onClick={() => setStep(2)} className="text-white text-xl mr-4">
                  &lt;
                </button>
                <h1 className="text-white text-xl font-semibold flex-1 text-center mr-6">회원가입</h1>
              </div>

              {/* 프로필 이미지 UI */}
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-500 transition">
                  <span className="text-gray-300 text-4xl">👤</span>
                </div>
              </div>

              <div>
                <input
                  {...registerName('name')}
                  type="text"
                  placeholder="닉네임을 입력해주세요!"
                  className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                disabled={!isNameValid}
                className={`w-full py-3 rounded font-semibold transition ${
                  isNameValid
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                회원가입 완료
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}