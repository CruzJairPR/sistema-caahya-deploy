"use client";
import { useCallback } from "react";
import { usePagination } from "./usePagination";
import { useServerData } from "./useServerData";
import { useTableCrud } from "./useTableCrud";
import { prideService } from "../services/prideService";
import { ComisionPride } from "../types/pride";

export function usePrideTable() {
  const pagination = usePagination(10);

  const fetcherData = useCallback(async () => {
    return prideService.getAll();
  }, []);

  const { data, total, loading, error, refetch } = useServerData<ComisionPride>(
    {
      fetcher: fetcherData,

      page: pagination.page,

      limit: pagination.limit,

      searchTerm: pagination.searchTerm,

      searchColumn: pagination.searchColumn,
    },
  );

  const crud = useTableCrud(prideService, refetch);

  return {
    datos: data,

    total,

    cargando: loading,

    error,

    ...pagination,

    ...crud,
  };
}
