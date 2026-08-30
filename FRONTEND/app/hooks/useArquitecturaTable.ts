"use client";

import { useState, useEffect } from "react";
import { arquitecturaService } from "../services/arquitecturaService";
import {
  MiembroArquitectura,
  NotificacionArquitectura,
} from "../types/arquitectura";

export function useArquitecturaTable() {
  const [datos, setDatos] = useState<MiembroArquitectura[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notificacion, setNotificacion] =
    useState<NotificacionArquitectura | null>(null);

  const mostrarNotificacion = (
    mensaje: string,
    tipo: "success" | "error" | "info",
  ) => {
    setNotificacion({ mensaje, tipo });
  };

  const cerrarNotificacion = () => setNotificacion(null);

  const obtenerMiembros = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await arquitecturaService.getAll();
      setDatos(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar los miembros de Arquitectura.",
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerMiembros();
  }, []);

  const handleAdd = async (newRow: Record<string, string>) => {
    try {
      await arquitecturaService.create(newRow);
      mostrarNotificacion("Miembro agregado con éxito.", "success");
      obtenerMiembros();
    } catch (err) {
      mostrarNotificacion(
        err instanceof Error ? err.message : "No se pudo agregar al miembro.",
        "error",
      );
    }
  };

  const handleEdit = async (updatedRow: MiembroArquitectura) => {
    if (!updatedRow._id)
      return mostrarNotificacion("ID inválido para actualizar.", "error");
    try {
      await arquitecturaService.update(updatedRow._id, updatedRow);
      mostrarNotificacion("Cambios guardados con éxito.", "success");
      obtenerMiembros();
    } catch (err) {
      mostrarNotificacion(
        err instanceof Error
          ? err.message
          : "No se pudieron guardar los cambios.",
        "error",
      );
    }
  };

  const handleDelete = async (rowToDelete: MiembroArquitectura) => {
    if (!rowToDelete._id)
      return mostrarNotificacion("ID inválido para eliminar.", "error");
    try {
      await arquitecturaService.remove(rowToDelete._id);
      mostrarNotificacion("Miembro eliminado con éxito.", "success");
      obtenerMiembros();
    } catch (err) {
      mostrarNotificacion(
        err instanceof Error ? err.message : "No se pudo eliminar al miembro.",
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
