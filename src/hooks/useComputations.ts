import { useRef, useCallback } from 'react';

export function useComputations<T>() {
  const cache = useRef(new Map<string, T>());

  const getOrCompute = useCallback((key: string, compute: () => T): T => {
    if (cache.current.has(key)) {
      return cache.current.get(key)!;
    }
    const result = compute();
    cache.current.set(key, result);
    return result;
  }, []);

  const clearCache = useCallback(() => {
    cache.current.clear();
  }, []);

  return { getOrCompute, clearCache };
}
