"use client";

import { useState, useEffect } from "react";
import { suayedService } from "../services/suayedService";
import { PlanEstudioSuayed } from "../types/suayed";

interface Notificacion {
  mensaje: string;
  tipo: "success" | "error" | "info";
}

export function useSuayedTable() {
  const [datos, setDatos] = useState<PlanEstudioSuayed[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notificacion, setNotificacion] = useState<Notificacion | null>(null);

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
      const data = await suayedService.getAll();
      setDatos(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar los planes SUAyED.",
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
      await suayedService.create(newRow);
      mostrarNotificacion("Licenciatura SUAyED agregada con éxito.", "success");
      obtenerPlanes();
    } catch (err) {
      mostrarNotificacion(
        err instanceof Error ? err.message : "No se pudo registrar en SUAyED.",
        "error",
      );
    }
  };

  const handleEdit = async (updatedRow: PlanEstudioSuayed) => {
    if (!updatedRow._id)
      return mostrarNotificacion("ID inválido para actualizar.", "error");
    try {
      await suayedService.update(updatedRow._id, updatedRow);
      mostrarNotificacion(
        "Registro SUAyED actualizado correctamente.",
        "success",
      );
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

  const handleDelete = async (rowToDelete: PlanEstudioSuayed) => {
    if (!rowToDelete._id)
      return mostrarNotificacion("ID inválido para eliminar.", "error");
    try {
      await suayedService.remove(rowToDelete._id);
      mostrarNotificacion("Registro eliminado del sistema SUAyED.", "success");
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
