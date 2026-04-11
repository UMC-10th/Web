import { useState } from 'react';

// useLocalStorage: localStorage와 state를 동기화하는 커스텀 훅
// 제네릭 <T>로 어떤 타입의 값이든 저장 가능
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // 초기 렌더 시 localStorage에서 값을 불러옴
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // 값을 업데이트할 때 state와 localStorage 모두 동기화
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error('localStorage 저장 실패');
    }
  };

  // 값을 삭제할 때 state와 localStorage 모두 초기화
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      localStorage.removeItem(key);
    } catch {
      console.error('localStorage 삭제 실패');
    }
  };

  return { storedValue, setValue, removeValue };
};

export default useLocalStorage;
