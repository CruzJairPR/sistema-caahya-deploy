import { useState, useEffect, useCallback } from "react";
import { ComisionDictaminadora, NotificacionComision } from "../types/comision";
import { comisionService } from "../services/comisionService";

export function useComisiones() {
  const [datos, setDatos] = useState<ComisionDictaminadora[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [notificacion, setNotificacion] = useState<NotificacionComision | null>(
    null,
  );

  const cargarComisiones = useCallback(async () => {
    setCargando(true);
    try {
      const deBaseDatos = await comisionService.getAll();
      setDatos(deBaseDatos);
    } catch (err) {
      setNotificacion({
        tipo: "error",
        mensaje: "No se pudieron cargar las comisiones desde el servidor",
      });
      setDatos([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarComisiones();
  }, [cargarComisiones]);

  const cerrarNotificacion = () => setNotificacion(null);

  const agregarComision = async (
    nuevaComision: Omit<ComisionDictaminadora, "_id">,
  ) => {
    try {
      await comisionService.create(nuevaComision);
      setNotificacion({
        tipo: "success",
        mensaje: "Comisión agregada con éxito",
      });
      cargarComisiones();
    } catch (err) {
      setNotificacion({
        tipo: "error",
        mensaje:
          err instanceof Error ? err.message : "Error al agregar comisión",
      });
    }
  };

  const editarComision = async (row: ComisionDictaminadora) => {
    if (!row._id) return;
    try {
      await comisionService.update(row._id, row);
      setNotificacion({
        tipo: "success",
        mensaje: "Cambios guardados con éxito",
      });
      cargarComisiones();
    } catch (err) {
      setNotificacion({
        tipo: "error",
        mensaje:
          err instanceof Error ? err.message : "Error al actualizar comisión",
      });
    }
  };

  const eliminarComision = async (row: ComisionDictaminadora) => {
    if (!row._id) return;
    try {
      await comisionService.delete(row._id);
      setNotificacion({
        tipo: "success",
        mensaje: "Comisión eliminada correctamente",
      });
      cargarComisiones();
    } catch (err) {
      setNotificacion({
        tipo: "error",
        mensaje:
          err instanceof Error ? err.message : "Error al eliminar comisión",
      });
    }
  };

  return {
    datos,
    cargando,
    notificacion,
    cerrarNotificacion,
    agregarComision,
    editarComision,
    eliminarComision,
  };
}
