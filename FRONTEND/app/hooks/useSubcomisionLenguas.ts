"use client";

import { useState, useEffect, useCallback } from "react";
import {
  SubcomisionMiembro,
  NotificacionConfig,
} from "../types/subcomisionLenguas";
import { subcomisionLenguasService } from "../services/subcomisionLenguasService";

export function useSubcomisionLenguas() {
  const [datos, setDatos] = useState<SubcomisionMiembro[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notificacion, setNotificacion] = useState<NotificacionConfig | null>(
    null,
  );

  const cerrarNotificacion = () => setNotificacion(null);

  const cargarMiembros = useCallback(async () => {
    try {
      const datosMapeados = await subcomisionLenguasService.getAll();
      setDatos(datosMapeados);
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

  const handleAdd = async (newRow: Record<string, any>) => {
    try {
      await subcomisionLenguasService.create(newRow);
      setNotificacion({
        tipo: "success",
        mensaje: "Miembro agregado correctamente.",
      });
      cargarMiembros();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setNotificacion({ tipo: "error", mensaje: errorMsg });
    }
  };

  const handleEdit = async (updatedRow: SubcomisionMiembro) => {
    if (!updatedRow._id) {
      setNotificacion({
        tipo: "error",
        mensaje: "No se puede editar: falta un ID válido.",
      });
      return;
    }
    try {
      await subcomisionLenguasService.update(updatedRow);
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

  const handleDelete = async (rowToDelete: SubcomisionMiembro) => {
    if (!rowToDelete._id) {
      setNotificacion({
        tipo: "error",
        mensaje: "No se puede eliminar: falta el ID.",
      });
      return;
    }

    try {
      await subcomisionLenguasService.delete(rowToDelete._id);
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
