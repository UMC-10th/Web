import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm";
import { validateSignin } from "../utils/validate";
import { ChevronLeft } from "lucide-react";
import type { AxiosError } from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const { values, errors, touched, getInputProps } = useForm({
    init_val: { email: "", password: "" },
    validate: validateSignin,
  });

  const isFormValid =
    !errors.email && !errors.password && !!values.email && !!values.password;

  const { mutate: handleLogin, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      const from = (location.state as { from?: string })?.from ?? "/";
      navigate(from, { replace: true });
    },
  });

  const serverError = error
    ? ((error as AxiosError<{ message: string }>).response?.data?.message ??
      "로그인 중 오류가 발생했습니다.")
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isPending) return;
    handleLogin(values);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] bg-[#0f1014] py-10">
      {/* 헤더 */}
      <div className="flex justify-center items-center relative w-full max-w-[400px] mb-8">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 p-2 text-white hover:text-[#FF1493] transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white">로그인</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-full max-w-[400px] px-4"
      >
        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            className={`bg-[#1a1a1a] border ${
              touched.email && errors.email ? "border-red-500" : "border-[#333]"
            } rounded-lg p-4 text-white placeholder-gray-500 focus:border-[#FF1493] outline-none transition-colors`}
            {...getInputProps("email")}
          />
          {touched.email && errors.email && (
            <span className="text-red-500 text-xs ml-1">{errors.email}</span>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-2">
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            className={`bg-[#1a1a1a] border ${
              touched.password && errors.password
                ? "border-red-500"
                : "border-[#333]"
            } rounded-lg p-4 text-white placeholder-gray-500 focus:border-[#FF1493] outline-none transition-colors`}
            {...getInputProps("password")}
          />
          {touched.password && errors.password && (
            <span className="text-red-500 text-xs ml-1">{errors.password}</span>
          )}
        </div>

        {/* 서버 에러 */}
        {serverError && (
          <p className="text-red-500 text-sm text-center">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={!isFormValid || isPending}
          className="mt-2 h-[52px] rounded-lg font-bold text-white transition-colors disabled:bg-[#333] disabled:cursor-not-allowed bg-[#FF1493] disabled:bg-[#333]"
        >
          {isPending ? "로그인 중..." : "로그인"}
        </button>

        <p className="text-center text-gray-500 text-sm">
          계정이 없으신가요?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#FF1493] cursor-pointer hover:underline"
          >
            회원가입
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
