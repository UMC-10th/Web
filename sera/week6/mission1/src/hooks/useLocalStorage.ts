export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    try {
      const valueToStore =
        typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, valueToStore);
    } catch (err) {
      console.error(err);
    }
  };

  const getItem = (): string | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const removeItem = () => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(err);
    }
  };

  return { setItem, getItem, removeItem };
};
