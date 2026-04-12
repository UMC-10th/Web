import { useState as useStateLS } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useStateLS<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("localStorage 저장 실패:", error);
    }
  };

  const removeValue = () => {
    window.localStorage.removeItem(key);
    setStoredValue(initialValue);
  };

  return [storedValue, setValue, removeValue] as const;
}