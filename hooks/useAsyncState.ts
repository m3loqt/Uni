import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncStateReturn<T> {
  state: AsyncState<T>;
  execute: (asyncFunction: () => Promise<T>) => Promise<void>;
  reset: () => void;
  setData: (data: T) => void;
  setError: (error: string) => void;
}

export function useAsyncState<T = any>(initialData: T | null = null): UseAsyncStateReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, error: null }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  return { state, execute, reset, setData, setError };
}