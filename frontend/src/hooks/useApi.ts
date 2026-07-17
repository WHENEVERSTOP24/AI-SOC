import { useState, useEffect, useCallback, useRef } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic hook for API data fetching with loading/error states and retry.
 *
 * @param fetcher - Async function returning `{ status, data, error }`.
 * @param fallbackData - Data to use when the API is unavailable (mock fallback).
 * @param deps - Dependency array to trigger re-fetch.
 */
export function useApi<T>(
  fetcher: () => Promise<{ status: string; data?: T; error?: string }>,
  fallbackData: T,
  deps: React.DependencyList = [],
): AsyncState<T> & {
  usingMock: boolean;
  isOffline: boolean;
  lastUpdated: string | null;
  dataSource: 'live' | 'cached' | 'mock';
  loadingLabel: string;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [retryCounter, setRetryCounter] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'live' | 'cached' | 'mock'>('mock');
  const [loadingLabel, setLoadingLabel] = useState('Loading...');
  const mountedRef = useRef(true);
  const hasCachedData = useRef(false);
  const fetchStartRef = useRef(0);

  const refetch = useCallback(() => {
    setRetryCounter((c) => c + 1);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      fetchStartRef.current = Date.now();

      // Show loader label after 300ms if still fetching
      const loaderTimeout = setTimeout(() => {
        if (mountedRef.current && !cancelled) {
          setLoadingLabel('Syncing with backend...');
        }
      }, 300);

      try {
        const result = await fetcher();

        clearTimeout(loaderTimeout);

        if (cancelled || !mountedRef.current) return;

        if (result.status === 'ok' && result.data !== undefined) {
          setData(result.data);
          setUsingMock(false);
          setIsOffline(false);
          setDataSource('live');
          setLastUpdated(new Date().toISOString());
          hasCachedData.current = true;
        } else {
          // API unavailable — use mock/cached fallback
          if (hasCachedData.current) {
            // We have real data from a previous fetch — keep it visible
            setDataSource('cached');
          } else {
            setData(fallbackData);
            setDataSource('mock');
          }
          setUsingMock(true);
          setIsOffline(result.status === 'error');
          setError(result.error || null);
        }
      } catch {
        clearTimeout(loaderTimeout);
        if (!cancelled && mountedRef.current) {
          if (hasCachedData.current) {
            setDataSource('cached');
          } else {
            setData(fallbackData);
            setDataSource('mock');
          }
          setUsingMock(true);
          setIsOffline(true);
          setError('Failed to fetch data.');
        }
      } finally {
        if (!cancelled && mountedRef.current) {
          setLoading(false);
          setLoadingLabel('Loading...');
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCounter, ...deps]);

  return {
    data, loading, error, refetch,
    usingMock, isOffline,
    lastUpdated, dataSource,
    loadingLabel,
  };
}
