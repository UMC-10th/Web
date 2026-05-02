import { useState, useCallback } from 'react';

type Validator<T> = (values: T) => Partial<Record<keyof T, string>>;

function useForm<T extends Record<string, string>>(
  initialValues: T,
  validate: Validator<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const newValues = { ...values, [name]: value } as T;
      setValues(newValues);
      setErrors(validate(newValues));
    },
    [values, validate]
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const isValid =
    Object.keys(validate(values)).length === 0 &&
    Object.values(values).every((v) => v.length > 0);

  return { values, errors, touched, handleChange, handleBlur, isValid };
}

export default useForm;
