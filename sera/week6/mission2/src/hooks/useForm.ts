import { useEffect, useState, type ChangeEvent } from "react";

interface UseFormProps<T> {
  init_val: T;
  validate: (values: T) => Record<string, string>;
}

function useForm<T extends Record<string, unknown>>({
  init_val,
  validate,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(init_val);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: keyof T, text: string) => {
    setValues((prev) => ({ ...prev, [name]: text }));
  };

  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const getInputProps = (name: keyof T) => {
    return {
      value: values[name] as string,
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleChange(name, e.target.value);
      },
      onBlur: () => {
        handleBlur(name);
      },
    };
  };

  useEffect(() => {
    setErrors(validate(values));
  }, [values]);

  return { values, errors, touched, getInputProps };
}

export default useForm;
