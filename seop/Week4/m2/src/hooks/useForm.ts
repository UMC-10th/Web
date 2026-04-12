import { useState } from 'react';

interface FormValues {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export function useForm() {
  const [values, setValues] = useState<FormValues>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (name: string, value: string) => {
    const newErrors = { ...errors };

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        newErrors.email = '올바른 이메일 형식을 입력해주세요.';
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'password') {
      if (value.length < 8) {
        newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const isValid =
    values.email !== '' &&
    values.password !== '' &&
    !errors.email &&
    !errors.password;

  return { values, errors, handleChange, isValid };
}