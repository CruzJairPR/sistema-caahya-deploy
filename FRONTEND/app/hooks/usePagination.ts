"use client";
import { useState, useCallback } from "react";
import type { ChangeEvent } from "react";

export function usePagination(initialLimit: number = 10) {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchColumn, setSearchColumn] = useState<string>("all");

  const handlePageChange = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setLimit(parseInt(event.target.value, 10));
      setPage(0);
    },
    [],
  );

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(0);
  }, []);

  const handleColumnChange = useCallback((column: string) => {
    setSearchColumn(column);
    setPage(0);
  }, []);

  return {
    page,
    limit,
    searchTerm,
    searchColumn,
    handlePageChange,
    handleLimitChange,
    handleSearchChange,
    handleColumnChange,
  };
}
