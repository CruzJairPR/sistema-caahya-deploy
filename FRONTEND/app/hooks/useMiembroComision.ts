// app/hooks/useMembersCommission.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { MiembroComision, NotificacionConfig } from "../types/miembroComision";
import { miembrosComisionService } from "../services/miembroComisionService";

export function useMiembrosComision() {
  const [datos, setDatos] = useState<MiembroComision[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notificacion, setNotificacion] = useState<NotificacionConfig | null>(
    null,
  );

  const cerrarNotificacion = () => setNotificacion(null);

  const cargarMiembros = useCallback(async () => {
    try {
      const data = await miembrosComisionService.getAll();
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
      await miembrosComisionService.create(newRow);
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

  const handleEdit = async (updatedRow: MiembroComision) => {
    if (!updatedRow._id) {
      setNotificacion({
        tipo: "error",
        mensaje: "No se puede editar: falta un ID válido.",
      });
      return;
    }
    try {
      await miembrosComisionService.update(updatedRow);
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

  const handleDelete = async (rowToDelete: MiembroComision) => {
    if (!rowToDelete._id) {
      setNotificacion({
        tipo: "error",
        mensaje: "No se puede eliminar: falta el ID.",
      });
      return;
    }

    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar a ${rowToDelete.Nombre || "este miembro"}?`,
      )
    ) {
      return;
    }

    try {
      await miembrosComisionService.delete(rowToDelete._id);
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
