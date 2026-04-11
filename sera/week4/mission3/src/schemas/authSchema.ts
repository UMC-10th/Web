import { z } from 'zod';

// 이메일 스키마: @ 와 . 이 포함된 올바른 형식
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식을 입력해주세요.'),
});

// 비밀번호 스키마: 6자 이상 + 비밀번호 확인 일치 검사
export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, '비밀번호는 6자 이상이어야 합니다.'),
    passwordConfirm: z.string().min(1, '비밀번호를 다시 입력해주세요.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'], // 에러를 passwordConfirm 필드에 표시
  });

// 닉네임 스키마
export const nicknameSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요.'),
});

// 로그인 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
});

// 스키마로부터 TypeScript 타입 추출
export type EmailFormData = z.infer<typeof emailSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type NicknameFormData = z.infer<typeof nicknameSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
