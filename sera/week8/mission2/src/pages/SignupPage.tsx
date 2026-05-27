import { useState } from "react";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronLeft, User } from "lucide-react";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다!" }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다!" })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다!" }),
    passwordCheck: z.string(),
    name: z
      .string()
      .min(2, { message: "닉네임은 2자 이상이어야 합니다." })
      .max(10, { message: "닉네임은 10자 이하로 설정해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

export default function SignUpPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPw, setShowPw] = useState(false);
  const [showPwCheck, setShowPwCheck] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormFields>({
    mode: "onChange",
    defaultValues: { email: "", password: "", passwordCheck: "", name: "" },
    resolver: zodResolver(schema),
  });

  const emailValue = watch("email");

  const goNext = async (fields: (keyof FormFields)[], nextStep: 1 | 2 | 3) => {
    const valid = await trigger(fields);
    if (valid) setStep(nextStep);
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { passwordCheck: _, ...rest } = data;
      await postSignup(rest);
      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "회원가입 중 오류가 발생했습니다.";
      alert(msg);
    }
  };

  const stepBack = () => {
    if (step === 1) navigate(-1);
    else setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] bg-[#0f1014] py-10 px-4">
      <div className="flex justify-center items-center relative w-full max-w-[400px] mb-8">
        <button
          type="button"
          onClick={stepBack}
          className="absolute left-0 p-2 text-white hover:text-[#FF1493] transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white">회원가입</h1>
        <div className="absolute right-0 flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                s <= step ? "bg-[#FF1493]" : "bg-[#333]"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-[400px]">
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <a
              href={`${import.meta.env.VITE_API_BASE_URL}/v1/auth/google/login`}
              className="border border-[#333] rounded-lg w-full h-[52px] relative flex justify-center items-center bg-[#1a1a1a] hover:bg-[#252525] text-white transition-colors"
            >
              <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              구글로 시작하기
            </a>

            <div className="flex items-center text-gray-500">
              <hr className="flex-1 border-[#333]" />
              <span className="px-4 text-xs">OR</span>
              <hr className="flex-1 border-[#333]" />
            </div>

            <div className="flex flex-col gap-2">
              <input
                {...register("email")}
                type="email"
                placeholder="이메일 주소"
                className={`bg-[#1a1a1a] border ${
                  errors.email ? "border-red-500" : "border-[#333]"
                } rounded-lg p-4 text-white placeholder-gray-500 focus:border-[#FF1493] outline-none transition-colors`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => goNext(["email"], 2)}
              className="h-[52px] rounded-lg bg-[#FF1493] text-white font-bold mt-2 hover:opacity-90 transition-opacity"
            >
              다음
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 mb-2">
              <p className="text-gray-400 text-xs mb-1">이메일</p>
              <p className="text-white font-semibold">{emailValue}</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPw ? "text" : "password"}
                  placeholder="비밀번호 (8자 이상)"
                  className={`bg-[#1a1a1a] border ${
                    errors.password ? "border-red-500" : "border-[#333]"
                  } rounded-lg w-full p-4 pr-12 text-white placeholder-gray-500 focus:border-[#FF1493] outline-none transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF1493] transition-colors"
                >
                  {showPw ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="relative">
                <input
                  {...register("passwordCheck")}
                  type={showPwCheck ? "text" : "password"}
                  placeholder="비밀번호 재확인"
                  className={`bg-[#1a1a1a] border ${
                    errors.passwordCheck ? "border-red-500" : "border-[#333]"
                  } rounded-lg w-full p-4 pr-12 text-white placeholder-gray-500 focus:border-[#FF1493] outline-none transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwCheck(!showPwCheck)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF1493] transition-colors"
                >
                  {showPwCheck ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {errors.passwordCheck && (
                <p className="text-red-500 text-xs ml-1">{errors.passwordCheck.message}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => goNext(["password", "passwordCheck"], 3)}
              className="h-[52px] rounded-lg bg-[#FF1493] text-white font-bold mt-2 hover:opacity-90 transition-opacity"
            >
              다음
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6 items-center">
            <div className="text-center">
              <h2 className="text-lg font-bold text-white mb-1">거의 다 왔어요!</h2>
              <p className="text-gray-400 text-sm">사용하실 닉네임을 설정해주세요.</p>
            </div>

            <div className="w-28 h-28 bg-[#1a1a1a] rounded-full flex items-center justify-center border-2 border-dashed border-[#FF1493]">
              <User className="text-gray-500" size={36} />
            </div>

            <div className="w-full flex flex-col gap-2">
              <input
                {...register("name")}
                placeholder="닉네임 입력 (2~10자)"
                className={`bg-[#1a1a1a] border ${
                  errors.name ? "border-red-500" : "border-[#333]"
                } rounded-lg w-full p-4 text-white text-center placeholder-gray-500 focus:border-[#FF1493] outline-none transition-colors`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs text-center">{errors.name.message}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !isValid}
              className="w-full h-[52px] rounded-lg bg-[#FF1493] text-white font-bold text-lg disabled:bg-[#333] disabled:cursor-not-allowed transition-colors hover:opacity-90"
            >
              {isSubmitting ? "처리 중..." : "회원가입 완료"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
