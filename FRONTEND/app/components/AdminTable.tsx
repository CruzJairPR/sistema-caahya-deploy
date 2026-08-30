"use client";

import React from "react";
import GenericTable from "./GenericTable";
import { useAuth } from "../context/AuthContext";

interface AdminTableProps<
  T extends Record<string, unknown>,
> extends React.ComponentProps<typeof GenericTable<T>> {}

export default function AdminTable<T extends Record<string, unknown>>({
  ...props
}: AdminTableProps<T>) {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando permisos...</div>;

  const esSoloConsulta = user?.rol === "ASISTENTE_EJECUTIVA";

  return <GenericTable {...props} readOnly={esSoloConsulta} />;
}
