import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
  emailSchema,
  passwordSchema,
  nicknameSchema,
  type EmailFormData,
  type PasswordFormData,
  type NicknameFormData,
} from '../schemas/signupSchema';

const GOOGLE_LOGIN_URL = 'http://localhost:8000/v1/auth/google/login';

// ─── Step 1: 이메일 ───────────────────────────────────────────
const EmailStep = ({
  onNext,
}: {
  onNext: (email: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
  });

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };

  return (
    <form onSubmit={handleSubmit((data) => onNext(data.email))} className="flex flex-col gap-4">
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

      {/* 이메일 입력 */}
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
      <button
        type="submit"
        disabled={!isValid}
        className="rounded-md text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 disabled:bg-[#2a2a2a] disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
        style={{ height: '40px' }}
      >
        다음
      </button>
    </form>
  );
};

// ─── Step 2: 비밀번호 ─────────────────────────────────────────
const PasswordStep = ({
  email,
  onNext,
}: {
  email: string;
  onNext: (password: string) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit((data) => onNext(data.password))} className="flex flex-col gap-4">
      {/* 입력된 이메일 표시 */}
      <div
        className="bg-transparent border border-gray-700 text-gray-400 text-sm px-4 rounded-md flex items-center gap-2"
        style={{ height: '40px' }}
      >
        <svg className="w-4 h-4 shrink-0 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m2 7 10 7 10-7" />
        </svg>
        {email}
      </div>

      {/* 비밀번호 */}
      <div className="flex flex-col gap-1">
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호를 입력해주세요!"
            className="w-full bg-transparent border border-gray-600 text-white text-sm px-4 pr-10 rounded-md outline-none placeholder-gray-500 focus:border-pink-500 transition-colors"
            style={{ height: '40px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-pink-500 text-xs px-1">{errors.password.message}</p>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex flex-col gap-1">
        <div className="relative">
          <input
            {...register('passwordConfirm')}
            type={showConfirm ? 'text' : 'password'}
            placeholder="비밀번호를 다시 입력해주세요!"
            className="w-full bg-transparent border border-gray-600 text-white text-sm px-4 pr-10 rounded-md outline-none placeholder-gray-500 focus:border-pink-500 transition-colors"
            style={{ height: '40px' }}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showConfirm ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errors.passwordConfirm && (
          <p className="text-pink-500 text-xs px-1">{errors.passwordConfirm.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="rounded-md text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 disabled:bg-[#2a2a2a] disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
        style={{ height: '40px' }}
      >
        다음
      </button>
    </form>
  );
};

// ─── Step 3: 닉네임 ───────────────────────────────────────────
const NicknameStep = ({
  onSubmit,
}: {
  onSubmit: (name: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<NicknameFormData>({
    resolver: zodResolver(nicknameSchema),
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data.name))} className="flex flex-col gap-4">
      {/* 프로필 이미지 UI */}
      <div className="flex justify-center">
        <div className="relative w-20 h-20 cursor-pointer group">
          <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-gray-600 group-hover:border-pink-500 transition-colors flex items-center justify-center overflow-hidden">
            <svg className="w-12 h-12 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <input
          {...register('name')}
          type="text"
          placeholder="닉네임을 입력해주세요!"
          className="bg-transparent border border-gray-600 text-white text-sm px-4 rounded-md outline-none placeholder-gray-500 focus:border-pink-500 transition-colors"
          style={{ height: '40px' }}
        />
        {errors.name && (
          <p className="text-pink-500 text-xs px-1">{errors.name.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="rounded-md text-sm font-bold text-white bg-pink-500 hover:bg-pink-600 disabled:bg-[#2a2a2a] disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
        style={{ height: '40px' }}
      >
        회원가입 완료
      </button>
    </form>
  );
};

// ─── 메인 SignupPage ──────────────────────────────────────────
const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailNext = (value: string) => {
    setEmail(value);
    setStep(2);
  };

  const handlePasswordNext = (value: string) => {
    setPassword(value);
    setStep(3);
  };

  const handleSignup = async (name: string) => {
    try {
      await axios.post('http://localhost:8000/v1/auth/signup', {
        email,
        password,
        name,
      });
      navigate('/');
    } catch {
      alert('회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다.');
    }
  };

  const stepTitle = ['회원가입', '비밀번호 설정', '닉네임 설정'][step - 1];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] px-4 -mt-16">
      <div className="w-full max-w-xs flex flex-col gap-6">
        {/* 헤더 */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => (step > 1 ? setStep((s) => s - 1) : navigate(-1))}
            className="absolute left-0 text-gray-400 hover:text-white text-lg font-bold"
          >
            &lt;
          </button>
          <h1 className="text-white text-lg font-bold">{stepTitle}</h1>
        </div>

        {/* 스텝 인디케이터 */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-colors ${
                s <= step ? 'bg-pink-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* 스텝별 폼 */}
        {step === 1 && <EmailStep onNext={handleEmailNext} />}
        {step === 2 && <PasswordStep email={email} onNext={handlePasswordNext} />}
        {step === 3 && <NicknameStep onSubmit={handleSignup} />}
      </div>
    </div>
  );
};

export default SignupPage;
