"use client";
import { useState, useEffect, useCallback } from "react";

interface ServerDataOptions<T> {
  fetcher: (
    page: number,
    limit: number,
    searchTerm: string,
    searchColumn: string,
  ) => Promise<T[] | { data: T[]; total: number }>;
  page: number;
  limit: number;
  searchTerm: string;
  searchColumn: string;
}

export function useServerData<T>({
  fetcher,
  page,
  limit,
  searchTerm,
  searchColumn,
}: ServerDataOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher(page, limit, searchTerm, searchColumn);

      if (Array.isArray(result)) {
        setData(result);
        setTotal(result.length);
      } else {
        setData(result.data);
        setTotal(result.total);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, [fetcher, page, limit, searchTerm, searchColumn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, total, loading, error, refetch: fetchData };
}
