import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { postSignin, postSignup } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { SignupFormValues } from "../types/auth";

const signupSchema = z
    .object({
        step: z.union([z.literal(1), z.literal(2), z.literal(3)]),
        email: z.string(),
        password: z.string(),
        passwordCheck: z.string(),
        name: z.string(),
    })
    .superRefine((data, ctx) => {
        const emailResult = z
            .string()
            .email({ message: "올바른 이메일 형식이 아닙니다. " })
            .safeParse(data.email);
        if (!emailResult.success) {
            emailResult.error.issues.forEach((issue) => {
                ctx.addIssue({ ...issue, path: ["email"] });
            });
        }

        if (data.step >= 2) {
            const passwordResult = z
                .string()
                .min(8, { message: "비밀번호는 8자 이상이어야 합니다. " })
                .max(20, { message: "비밀번호는 20자 이하이어야 합니다. " })
                .safeParse(data.password);
            if (!passwordResult.success) {
                passwordResult.error.issues.forEach((issue) => {
                    ctx.addIssue({ ...issue, path: ["password"] });
                });
            }

            const passwordCheckResult = z
                .string()
                .min(8, { message: "비밀번호 확인은 8자 이상이어야 합니다. " })
                .max(20, { message: "비밀번호 확인은 20자 이하이어야 합니다. " })
                .safeParse(data.passwordCheck);
            if (!passwordCheckResult.success) {
                passwordCheckResult.error.issues.forEach((issue) => {
                    ctx.addIssue({ ...issue, path: ["passwordCheck"] });
                });
            }

            if (
                passwordResult.success &&
                passwordCheckResult.success &&
                data.password !== data.passwordCheck
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "비밀번호와 비밀번호 확인이 일치하지 않습니다. ",
                    path: ["passwordCheck"],
                });
            }
        }

        if (data.step >= 3) {
            const nameResult = z
                .string()
                .min(1, { message: "닉네임을 입력해주세요. " })
                .safeParse(data.name);
            if (!nameResult.success) {
                nameResult.error.issues.forEach((issue) => {
                    ctx.addIssue({ ...issue, path: ["name"] });
                });
            }
        }
    });

const inputClass = (hasError: boolean) =>
    `border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${
        hasError ? "border-red-500 bg-red-200" : "border-gray-300"
    }`;

const SignupPage = () => {
    const navigate = useNavigate();
    const [, setItem] = useLocalStorage<string>(LOCAL_STORAGE_KEY.accessToken, '')
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormValues>({
        defaultValues: {
            step: 1,
            name: "",
            email: "",
            password: "",
            passwordCheck: "",
        },
        resolver: zodResolver(signupSchema) as Resolver<SignupFormValues>,
        mode: "onChange",
    });

    useEffect(() => {
        setValue("step", step);
    }, [step, setValue]);

    const emailVal = watch("email");
    const passwordVal = watch("password");
    const passwordCheckVal = watch("passwordCheck");
    const nameVal = watch("name");

    const step1Disabled = !emailVal?.trim() || !!errors.email;
    const step2Disabled =
        !passwordVal ||
        !passwordCheckVal ||
        !!errors.password ||
        !!errors.passwordCheck;
    const step3Disabled = !nameVal?.trim() || !!errors.name;

    const handleBack = () => {
        if (step === 1) {
            navigate("/");
            return;
        }
        const prev = step === 2 ? 1 : 2;
        setStep(prev);
        setValue("step", prev);
    };

    const handleEmailNext = async () => {
        setValue("step", 1);
        const ok = await trigger();
        if (!ok) return;
        setStep(2);
        setValue("step", 2);
    };

    const handlePasswordNext = async () => {
        setValue("step", 2);
        const ok = await trigger();
        if (!ok) return;
        setStep(3);
        setValue("step", 3);
    };

    const onSubmit: SubmitHandler<SignupFormValues> = async (data: SignupFormValues) => {
        setValue("step", 3);
        try {
            await postSignup({
                name: data.name.trim(),
                email: data.email.trim(),
                password: data.password,
            });
            const signinRes = await postSignin({
                email: data.email.trim(),
                password: data.password,
            });
            setItem(signinRes.data.accessToken);
            navigate("/");
        } catch (error) {
            const message = error instanceof Error ? error.message : "회원가입에 실패했습니다.";
            alert(message);
        }
    };

    return (
        <>
            <div className='flex flex-col items-center justify-center h-full gap-4 px-4'>
                <div className='flex w-[300px] flex-col gap-3'>
                    <div className='relative flex items-center justify-center pb-1'>
                        <button
                            type='button'
                            onClick={handleBack}
                            className='absolute left-0 text-gray-600 hover:text-gray-900'
                            aria-label='뒤로'
                        >
                            ‹
                        </button>
                        <span className='text-base font-semibold text-gray-900'>회원가입</span>
                    </div>

                    {step === 1 && (
                        <>
                            <input
                                {...register("email")}
                                name='email'
                                type='email'
                                className={inputClass(!!errors?.email)}
                                placeholder={'이메일'}
                            />
                            {errors?.email && (
                                <div className='text-red-500 text-sm'>{errors.email.message}</div>
                            )}
                            <button
                                type='button'
                                onClick={handleEmailNext}
                                disabled={step1Disabled}
                                className='w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors coursor-pointer disabled:bg-gray-300'
                            >
                                다음
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className='rounded-sm border border-[#ccc] bg-gray-50 px-3 py-2 text-sm text-gray-800'>
                                {watch("email")?.trim()}
                            </div>
                            <div className='relative'>
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    className={`${inputClass(!!errors?.password)} pr-10`}
                                    placeholder={'비밀번호'}
                                />
                                <button
                                    type='button'
                                    className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800'
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                                >
                                    {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                </button>
                            </div>
                            {errors?.password && (
                                <div className='text-red-500 text-sm'>{errors.password.message}</div>
                            )}
                            <div className='relative'>
                                <input
                                    {...register("passwordCheck")}
                                    type={showPasswordCheck ? "text" : "password"}
                                    className={`${inputClass(!!errors?.passwordCheck)} pr-10`}
                                    placeholder={'비밀번호 확인'}
                                />
                                <button
                                    type='button'
                                    className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800'
                                    onClick={() => setShowPasswordCheck((v) => !v)}
                                    aria-label={showPasswordCheck ? "비밀번호 숨기기" : "비밀번호 보기"}
                                >
                                    {showPasswordCheck ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                </button>
                            </div>
                            {errors?.passwordCheck && (
                                <div className='text-red-500 text-sm'>{errors.passwordCheck.message}</div>
                            )}
                            <button
                                type='button'
                                onClick={handlePasswordNext}
                                disabled={step2Disabled}
                                className='w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors coursor-pointer disabled:bg-gray-300'
                            >
                                다음
                            </button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className='mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-200'>
                                <ProfilePlaceholderIcon />
                            </div>
                            <p className='text-center text-xs text-gray-500'>프로필 이미지 (추가 예정)</p>
                            <input
                                {...register("name")}
                                type='text'
                                className={inputClass(!!errors?.name)}
                                placeholder={'닉네임'}
                            />
                            {errors?.name && (
                                <div className='text-red-500 text-sm'>{errors.name.message}</div>
                            )}
                            <button
                                disabled={isSubmitting || step3Disabled}
                                type='button'
                                onClick={handleSubmit(onSubmit)}
                                className='w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors coursor-pointer disabled:bg-gray-300'
                            >
                                회원가입 완료
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

function EyeClosedIcon() {
    return (
        <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden>
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
            />
        </svg>
    );
}

function EyeOpenIcon() {
    return (
        <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
            />
        </svg>
    );
}

function ProfilePlaceholderIcon() {
    return (
        <svg className='h-12 w-12 text-gray-500' fill='currentColor' viewBox='0 0 24 24' aria-hidden>
            <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
        </svg>
    );
}

export default SignupPage;