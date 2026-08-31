"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { MiembroCarreraReg, NotificacionConfig } from "../types/carreras";
import { comisionCarrerasService } from "../services/carrerasService";

export function useCarreras(carreraSlug: string) {
  const [datos, setDatos] = useState<MiembroCarreraReg[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notificacion, setNotificacion] = useState<NotificacionConfig | null>(
    null,
  );

  // Aseguramos que el endpoint base sea consistente (ej: "carreras/arquitectura")
  const apiEndpoint = useMemo(() => {
    if (!carreraSlug) return "";
    return carreraSlug.startsWith("carreras/")
      ? carreraSlug
      : `carreras/${carreraSlug}`;
  }, [carreraSlug]);

  const cerrarNotificacion = () => setNotificacion(null);

  const cargarMiembros = useCallback(async () => {
    if (!apiEndpoint) return;
    try {
      setCargando(true);
      const response: any = await comisionCarrerasService.getAll(apiEndpoint);

      const items = Array.isArray(response) ? response : response?.data || [];
      setDatos(items);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(`Error al cargar los datos: ${errorMsg}`);
      setDatos([]);
    } finally {
      setCargando(false);
    }
  }, [apiEndpoint]);

  useEffect(() => {
    cargarMiembros();
  }, [cargarMiembros]);

  const handleAdd = async (newRow: Record<string, string>) => {
    try {
      await comisionCarrerasService.create(apiEndpoint, newRow);
      setNotificacion({
        tipo: "success",
        mensaje: "Miembro agregado con éxito.",
      });
      cargarMiembros();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setNotificacion({ tipo: "error", mensaje: errorMsg });
    }
  };

  const handleEdit = async (updatedRow: MiembroCarreraReg) => {
    if (!updatedRow._id) {
      setNotificacion({ tipo: "error", mensaje: "Falta un ID válido." });
      return;
    }
    try {
      await comisionCarrerasService.update(apiEndpoint, updatedRow);
      setNotificacion({
        tipo: "success",
        mensaje: "Cambios guardados con éxito.",
      });
      cargarMiembros();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setNotificacion({ tipo: "error", mensaje: errorMsg });
    }
  };

  const handleDelete = async (rowToDelete: MiembroCarreraReg) => {
    if (!rowToDelete._id) {
      setNotificacion({ tipo: "error", mensaje: "Falta el ID." });
      return;
    }

    try {
      await comisionCarrerasService.delete(apiEndpoint, rowToDelete._id);
      setNotificacion({
        tipo: "success",
        mensaje: "Miembro eliminado con éxito.",
      });
      cargarMiembros();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setNotificacion({ tipo: "error", mensaje: errorMsg });
    }
  };
  return {
    datos,
    cargando,
    error,
    notificacion,
    cerrarNotificacion,
    handleAdd,
    handleEdit,
    handleDelete,
  };
}
