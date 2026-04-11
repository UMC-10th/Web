import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';

// 이메일 유효성 검사: @ 와 . 이 모두 포함되어야 함
const validateEmail = (value: string) => {
  if (!value.includes('@') || !value.includes('.')) {
    return '올바른 이메일 형식을 입력해주세요.';
  }
  return '';
};

// 비밀번호 유효성 검사: 최소 8자 이상
const validatePassword = (value: string) => {
  if (value.length < 8) {
    return '비밀번호는 8자 이상이어야 합니다.';
  }
  return '';
};

const LoginPage = () => {
  const navigate = useNavigate();

  // useForm 훅에 초기값과 각 필드의 validator 전달
  const { values, errors, handleChange, isValid } = useForm(
    { email: '', password: '' },
    { email: validateEmail, password: validatePassword }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // 로그인 API 연동 예정
    console.log('로그인 시도:', values.email);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* 헤더: 뒤로가기 버튼(절대 위치) + 중앙 타이틀 */}
        <div className="flex items-center mb-8 relative">
          {/* navigate(-1): 이전 페이지로 이동 */}
          <button
            onClick={() => navigate(-1)}
            className="text-white text-lg hover:text-gray-300 transition absolute left-0"
          >
            &lt;
          </button>
          <h1 className="text-white text-xl font-bold w-full text-center">로그인</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* 구글 소셜 로그인 버튼 */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-600 rounded-lg px-4 py-3 text-white hover:bg-gray-900 transition"
          >
            {/* 구글 G 컬러 아이콘 */}
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            구글 로그인
          </button>

          {/* OR 구분선: 양쪽에 선 + 가운데 텍스트 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-600" />
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-600" />
          </div>

          {/* 이메일 입력 필드 */}
          <div className="flex flex-col gap-1">
            <input
              type="text"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="이메일을 입력해주세요!"
              className="w-full bg-black text-white placeholder-gray-600 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-gray-400"
            />
            {/* 값이 있을 때만 에러 메시지 표시 (입력 전에는 에러 안 보임) */}
            {values.email && errors.email && (
              <p className="text-pink-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* 비밀번호 입력 필드 */}
          <div className="flex flex-col gap-1">
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해주세요!"
              className="w-full bg-black text-white placeholder-gray-600 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-gray-400"
            />
            {/* 값이 있을 때만 에러 메시지 표시 */}
            {values.password && errors.password && (
              <p className="text-pink-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* 로그인 버튼: isValid가 true일 때만 핑크색으로 활성화 */}
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
