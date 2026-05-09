export type UserSigninInfo = {
  email: string;
  password: string;
};

const EMAIL_REGEX =
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

function validateUser(vals: UserSigninInfo) {
  const errors: Record<string, string> = {
    email: "",
    password: "",
  };

  if (!EMAIL_REGEX.test(vals.email)) {
    errors.email = "올바른 이메일 형식이 아닙니다!";
  }

  // 수정: 빈 문자열(length=0)도 잡히도록 >= 8 조건만으로 충분하지 않았음
  if (vals.password.length < 8 || vals.password.length >= 20) {
    errors.password = "비밀번호는 8 ~ 20자 사이로 입력해주세요!";
  }

  return errors;
}

export function validateSignin(vals: UserSigninInfo) {
  return validateUser(vals);
}
