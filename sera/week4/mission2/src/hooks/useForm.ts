import { useState, useCallback } from 'react';

// 각 필드별 유효성 검사 함수 타입
// 값을 받아서 에러 메시지를 반환 (에러 없으면 빈 문자열)
type Validators<T> = Partial<Record<keyof T, (value: string) => string>>;

// useForm: 폼 상태, 에러, 변경 핸들러를 한 번에 관리하는 커스텀 훅
// 제네릭 <T>로 어떤 폼 형태든 재사용 가능하도록 설계
const useForm = <T extends Record<string, string>>(
  initialValues: T,       // 각 필드의 초기값
  validators: Validators<T> // 각 필드의 유효성 검사 함수
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  // 입력값이 바뀔 때마다 해당 필드의 유효성 검사 실행
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const key = name as keyof T;

      // 입력값 상태 업데이트
      setValues((prev) => ({ ...prev, [key]: value }));

      // 해당 필드의 validator가 있으면 실행해서 에러 메시지 세팅
      if (validators[key]) {
        const errorMsg = validators[key]!(value);
        setErrors((prev) => ({ ...prev, [key]: errorMsg }));
      }
    },
    [validators]
  );

  // 모든 필드가 비어있지 않고, 모든 에러가 없을 때만 true
  const isValid =
    Object.keys(initialValues).every((key) => values[key as keyof T] !== '') &&
    Object.values(errors).every((err) => err === '');

  return { values, errors, handleChange, isValid };
};

export default useForm;
