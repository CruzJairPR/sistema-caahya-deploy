"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ComisionPermanenteReg,
  NotificacionConfig,
} from "../types/comisionPermanente";
import { comisionPermanenteService } from "../services/comisionPermanenteService";

export function useComisionPermanente() {
  const [datos, setDatos] = useState<ComisionPermanenteReg[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notificacion, setNotificacion] = useState<NotificacionConfig | null>(
    null,
  );

  const cerrarNotificacion = () => setNotificacion(null);

  const cargarComisiones = useCallback(async () => {
    try {
      const data = await comisionPermanenteService.getAll();
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
    cargarComisiones();
  }, [cargarComisiones]);

  const handleAdd = async (newRow: Record<string, string>) => {
    try {
      await comisionPermanenteService.create(newRow);
      setNotificacion({
        tipo: "success",
        mensaje: "Comisión registrada correctamente.",
      });
      cargarComisiones();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setNotificacion({ tipo: "error", mensaje: errorMsg });
    }
  };

  const handleEdit = async (updatedRow: ComisionPermanenteReg) => {
    if (!updatedRow._id) {
      setNotificacion({
        tipo: "error",
        mensaje: "No se puede editar: falta un ID válido.",
      });
      return;
    }
    try {
      await comisionPermanenteService.update(updatedRow);
      setNotificacion({
        tipo: "success",
        mensaje: "Cambios guardados con éxito.",
      });
      cargarComisiones();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setNotificacion({ tipo: "error", mensaje: errorMsg });
    }
  };

  const handleDelete = async (rowToDelete: ComisionPermanenteReg) => {
    if (!rowToDelete._id) {
      setNotificacion({
        tipo: "error",
        mensaje: "No se puede eliminar: falta el ID.",
      });
      return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      return;
    }

    try {
      await comisionPermanenteService.delete(rowToDelete._id);
      setNotificacion({
        tipo: "success",
        mensaje: "Registro eliminado con éxito.",
      });
      cargarComisiones();
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
