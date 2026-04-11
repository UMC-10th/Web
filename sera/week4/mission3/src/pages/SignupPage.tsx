import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emailSchema,
  passwordSchema,
  nicknameSchema,
  type EmailFormData,
  type PasswordFormData,
  type NicknameFormData,
} from '../schemas/authSchema';
import useLocalStorage from '../hooks/useLocalStorage';
import type { AuthTokens } from '../types/auth';

// 다단계 회원가입: 1단계(이메일) → 2단계(비밀번호) → 3단계(닉네임)
type Step = 1 | 2 | 3;

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');           // 단계 간 이메일 공유
  const [password, setPassword] = useState('');     // 단계 간 비밀번호 공유
  const [showPassword, setShowPassword] = useState(false);       // 비밀번호 표시 토글
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // 비밀번호 확인 표시 토글

  // 회원가입 성공 후 토큰을 localStorage에 저장하기 위한 커스텀 훅
  const { setValue: setTokens } = useLocalStorage<AuthTokens | null>('tokens', null);

  // --- Step 1: 이메일 폼 ---
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema), // Zod 스키마로 유효성 검사
    mode: 'onChange',                   // 입력할 때마다 실시간 검사
  });

  // --- Step 2: 비밀번호 폼 ---
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });

  // --- Step 3: 닉네임 폼 ---
  const nicknameForm = useForm<NicknameFormData>({
    resolver: zodResolver(nicknameSchema),
    mode: 'onChange',
  });

  // Step 1 제출: 이메일 저장 후 2단계로 이동
  const onEmailSubmit = (data: EmailFormData) => {
    setEmail(data.email);
    setStep(2);
  };

  // Step 2 제출: 비밀번호 저장 후 3단계로 이동
  const onPasswordSubmit = (data: PasswordFormData) => {
    setPassword(data.password);
    setStep(3);
  };

  // Step 3 제출: 서버에 회원가입 요청
  const onNicknameSubmit = async (data: NicknameFormData) => {
    try {
      const res = await fetch('http://localhost:8000/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: data.nickname }),
      });

      if (!res.ok) throw new Error('회원가입 실패');

      const tokens = (await res.json()) as AuthTokens;
      // 토큰을 localStorage에 저장
      setTokens(tokens);
      navigate('/'); // 홈으로 이동
    } catch {
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 뒤로가기: step이 1이면 이전 페이지, 아니면 이전 단계로
  const handleBack = () => {
    if (step === 1) navigate(-1);
    else setStep((prev) => (prev - 1) as Step);
  };

  // 공통 헤더 (뒤로가기 + 타이틀)
  const Header = () => (
    <div className="flex items-center mb-6 relative">
      <button
        onClick={handleBack}
        className="text-white text-lg absolute left-0 hover:text-gray-300 transition"
      >
        &lt;
      </button>
      <h1 className="text-white text-xl font-bold w-full text-center">회원가입</h1>
    </div>
  );

  // 공통 입력 필드 스타일
  const inputClass =
    'w-full bg-black text-white placeholder-gray-600 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-gray-400';

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* ===== STEP 1: 이메일 입력 ===== */}
        {step === 1 && (
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="flex flex-col gap-4">
            <Header />

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
                {...emailForm.register('email')}
                type="text"
                placeholder="이메일을 입력해주세요!"
                className={inputClass}
              />
              {/* react-hook-form의 에러 메시지 표시 */}
              {emailForm.formState.errors.email && (
                <p className="text-pink-500 text-sm">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* 다음 버튼: 이메일이 유효할 때만 활성화 */}
            <button
              type="submit"
              disabled={!emailForm.formState.isValid}
              className="w-full py-3 rounded-lg font-bold text-white transition
                disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed
                enabled:bg-pink-500 enabled:hover:bg-pink-600"
            >
              다음
            </button>
          </form>
        )}

        {/* ===== STEP 2: 비밀번호 입력 ===== */}
        {step === 2 && (
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="flex flex-col gap-4">
            <Header />

            {/* 이전 단계에서 입력한 이메일 표시 */}
            <div className="flex items-center gap-2 text-white text-sm">
              <span>✉</span>
              <span>{email}</span>
            </div>

            {/* 비밀번호 입력 (눈 아이콘으로 토글) */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <input
                  {...passwordForm.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력해주세요!"
                  className={`${inputClass} pr-12`}
                />
                {/* 비밀번호 표시/숨김 토글 버튼 */}
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? '👁' : '👁‍🗨'}
                </button>
              </div>
              {passwordForm.formState.errors.password && (
                <p className="text-pink-500 text-sm">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* 비밀번호 확인 입력 */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <input
                  {...passwordForm.register('passwordConfirm')}
                  type={showPasswordConfirm ? 'text' : 'password'}
                  placeholder="비밀번호를 다시 한 번 입력해주세요!"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPasswordConfirm ? '👁' : '👁‍🗨'}
                </button>
              </div>
              {/* 비밀번호 불일치 에러: Zod의 refine에서 발생 */}
              {passwordForm.formState.errors.passwordConfirm && (
                <p className="text-pink-500 text-sm">
                  {passwordForm.formState.errors.passwordConfirm.message}
                </p>
              )}
            </div>

            {/* 다음 버튼: 비밀번호가 유효하고 일치할 때만 활성화 */}
            <button
              type="submit"
              disabled={!passwordForm.formState.isValid}
              className="w-full py-3 rounded-lg font-bold text-white transition
                disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed
                enabled:bg-pink-500 enabled:hover:bg-pink-600"
            >
              다음
            </button>
          </form>
        )}

        {/* ===== STEP 3: 닉네임 입력 ===== */}
        {step === 3 && (
          <form onSubmit={nicknameForm.handleSubmit(onNicknameSubmit)} className="flex flex-col gap-4 items-center">
            <Header />

            {/* 프로필 이미지 UI (기능 미구현, 시각적 완성도용) */}
            <div className="w-28 h-28 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-500 transition">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="#9ca3af"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            {/* 닉네임 입력 */}
            <div className="flex flex-col gap-1 w-full">
              <input
                {...nicknameForm.register('nickname')}
                type="text"
                placeholder="닉네임을 입력해주세요!"
                className={inputClass}
              />
              {nicknameForm.formState.errors.nickname && (
                <p className="text-pink-500 text-sm">
                  {nicknameForm.formState.errors.nickname.message}
                </p>
              )}
            </div>

            {/* 회원가입 완료 버튼: 닉네임이 입력됐을 때만 활성화 */}
            <button
              type="submit"
              disabled={!nicknameForm.formState.isValid}
              className="w-full py-3 rounded-lg font-bold text-white transition
                disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed
                enabled:bg-pink-500 enabled:hover:bg-pink-600"
            >
              회원가입 완료
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
