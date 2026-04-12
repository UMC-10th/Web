import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().trim().min(1, "이름을 입력해주세요."),
    email: z.string().email("이메일 형식이 올바르지 않습니다."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .max(19, "비밀번호는 20자 미만이어야 합니다."),
    passwordConfirm: z.string(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordConfirm"],
      });
    }
    const av = data.avatar?.trim();
    if (av && !z.string().url().safeParse(av).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "올바른 URL을 입력해주세요.",
        path: ["avatar"],
      });
    }
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
