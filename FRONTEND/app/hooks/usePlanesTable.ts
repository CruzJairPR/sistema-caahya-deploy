"use client";

import { useState, useEffect } from "react";
import { planesService } from "../services/planesService";
import { PlanEstudio, NotificacionPlanes } from "../types/planes";

export function usePlanesTable() {
  const [datos, setDatos] = useState<PlanEstudio[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notificacion, setNotificacion] = useState<NotificacionPlanes | null>(
    null,
  );

  const mostrarNotificacion = (
    mensaje: string,
    tipo: "success" | "error" | "info",
  ) => {
    setNotificacion({ mensaje, tipo });
  };

  const cerrarNotificacion = () => setNotificacion(null);

  const obtenerPlanes = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await planesService.getAll();
      setDatos(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar los planes de estudio.",
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerPlanes();
  }, []);

  const handleAdd = async (newRow: Record<string, string>) => {
    try {
      await planesService.create(newRow);
      mostrarNotificacion("Licenciatura agregada exitosamente.", "success");
      obtenerPlanes();
    } catch (err) {
      mostrarNotificacion(
        err instanceof Error ? err.message : "No se pudo procesar el registro.",
        "error",
      );
    }
  };

  const handleEdit = async (updatedRow: PlanEstudio) => {
    if (!updatedRow._id)
      return mostrarNotificacion("ID inválido para actualizar.", "error");
    try {
      await planesService.update(updatedRow._id, updatedRow);
      mostrarNotificacion("Cambios guardados con éxito.", "success");
      obtenerPlanes();
    } catch (err) {
      mostrarNotificacion(
        err instanceof Error
          ? err.message
          : "No se pudieron guardar los cambios.",
        "error",
      );
    }
  };

  const handleDelete = async (rowToDelete: PlanEstudio) => {
    if (!rowToDelete._id)
      return mostrarNotificacion("ID inválido para eliminar.", "error");
    try {
      await planesService.remove(rowToDelete._id);
      mostrarNotificacion("Licenciatura eliminada correctamente.", "success");
      obtenerPlanes();
    } catch (err) {
      mostrarNotificacion(
        err instanceof Error ? err.message : "No se pudo eliminar el registro.",
        "error",
      );
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
