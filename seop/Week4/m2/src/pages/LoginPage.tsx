import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from '../hooks/useForm';

export default function LoginPage() {
  const navigate = useNavigate();
  const { values, errors, handleChange, isValid } = useForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/v1/auth/login', {
        email: values.email,
        password: values.password,
      });
      console.log('로그인 성공:', response.data);
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* 로그인 폼 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm px-4">
          {/* 뒤로가기 + 타이틀 */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-white text-xl mr-4"
            >
              &lt;
            </button>
            <h1 className="text-white text-xl font-semibold flex-1 text-center mr-6">
              로그인
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* 구글 로그인 */}
            <button
              type="button"
              className="flex items-center justify-center gap-3 border border-gray-600 rounded px-4 py-3 text-white hover:bg-gray-800 transition"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="google"
                className="w-5 h-5"
              />
              구글 로그인
            </button>

            {/* OR 구분선 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-600" />
              <span className="text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-600" />
            </div>

            {/* 이메일 */}
            <div>
              <input
                type="text"
                name="email"
                placeholder="이메일을 입력해주세요!"
                value={values.email}
                onChange={handleChange}
                className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
              />
              {errors.email && (
                <p className="text-pink-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="비밀번호를 입력해주세요!"
                value={values.password}
                onChange={handleChange}
                className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
              />
              {errors.password && (
                <p className="text-pink-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* 로그인 버튼 */}
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