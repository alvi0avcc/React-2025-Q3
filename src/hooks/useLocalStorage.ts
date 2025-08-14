'use client';

import { localStorageKey } from '@src/const/const';
import { useState, useEffect } from 'react';

export function useLocalStorage(
  key: string = localStorageKey
): [string, (value: string) => void] {
  const [query, setQuery] = useState<string>(
    (localStorage.getItem(key) || '').trim()
  );

  useEffect(() => {
    localStorage.setItem(key, query);
  }, [query, key]);

  return [query, setQuery];
}
