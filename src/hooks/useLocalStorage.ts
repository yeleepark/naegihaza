'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY_PREFIX = 'naegihaza-';

export function useLocalStorage(key: string, initialValue: string = ''): [string, (value: string) => void] {
  const fullKey = STORAGE_KEY_PREFIX + key;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(fullKey);
      if (stored !== null) {
        setValue(stored);
      }
    } catch {
      // localStorage not available
    }
  }, [fullKey]);

  const setStoredValue = (newValue: string) => {
    setValue(newValue);
    try {
      localStorage.setItem(fullKey, newValue);
    } catch {
      // localStorage not available
    }
  };

  return [value, setStoredValue];
}
