import { useState, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T[]) {
  const [items, setItems] = useState<T[]>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const save = useCallback((data: T[]) => {
    setItems(data);
    localStorage.setItem(key, JSON.stringify(data));
  }, [key]);

  const add = useCallback((item: T) => {
    const updated = [...items, item];
    save(updated);
  }, [items, save]);

  const update = useCallback((index: number, item: T) => {
    const updated = [...items];
    updated[index] = item;
    save(updated);
  }, [items, save]);

  const remove = useCallback((index: number) => {
    const updated = items.filter((_, i) => i !== index);
    save(updated);
  }, [items, save]);

  const reset = useCallback(() => {
    save(initialValue);
  }, [initialValue, save]);

  return { items, add, update, remove, reset, setItems: save };
}
