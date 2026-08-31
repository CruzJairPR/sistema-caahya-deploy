"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MiembroComisionArtes,
  NotificacionConfig,
} from "../types/comisionArtes";
import { comisionArtesService } from "../services/comisionArtesService";

export function useComisionArtes() {
  const [datos, setDatos] = useState<MiembroComisionArtes[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notificacion, setNotificacion] = useState<NotificacionConfig | null>(
    null,
  );

  const cerrarNotificacion = () => setNotificacion(null);

  const cargarMiembros = useCallback(async () => {
    try {
      const data = await comisionArtesService.getAll();
      setDatos(data);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(`Error al cargar los datos: ${errorMsg}`);
      setDatos([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarMiembros();
  }, [cargarMiembros]);

  const handleAdd = async (newRow: Record<string, string>) => {
    try {
      await comisionArtesService.create(newRow);
      setNotificacion({
        tipo: "success",
        mensaje: "Miembro agregado exitosamente.",
      });
      cargarMiembros();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setNotificacion({ tipo: "error", mensaje: errorMsg });
    }
  };

  const handleEdit = async (updatedRow: MiembroComisionArtes) => {
    if (!updatedRow._id) {
      setNotificacion({
        tipo: "error",
        mensaje: "No se puede editar: falta un ID válido.",
      });
      return;
    }
    try {
      await comisionArtesService.update(updatedRow);
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

  const handleDelete = async (rowToDelete: MiembroComisionArtes) => {
    if (!rowToDelete._id) {
      setNotificacion({
        tipo: "error",
        mensaje: "No se puede eliminar: falta el ID.",
      });
      return;
    }

    try {
      await comisionArtesService.delete(rowToDelete._id);
      setNotificacion({
        tipo: "success",
        mensaje: "Registro eliminado con éxito.",
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
