import { useEffect, useState } from 'react';

const localStorageEventName = 'local-storage-change';

const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(localStorageEventName));
  };

  const removeValue = () => {
    setStoredValue(initialValue);
    localStorage.removeItem(key);
    window.dispatchEvent(new Event(localStorageEventName));
  };

  useEffect(() => {
    const syncValue = () => {
      const item = localStorage.getItem(key);
      setStoredValue(item ? (JSON.parse(item) as T) : initialValue);
    };

    window.addEventListener('storage', syncValue);
    window.addEventListener(localStorageEventName, syncValue);

    return () => {
      window.removeEventListener('storage', syncValue);
      window.removeEventListener(localStorageEventName, syncValue);
    };
  }, [initialValue, key]);

  return [storedValue, setValue, removeValue] as const;
};

export default useLocalStorage;
