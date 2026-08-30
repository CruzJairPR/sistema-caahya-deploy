"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dictaminadora,
  NotificacionDictaminadora,
} from "../types/dictaminadora";
import { dictaminadoraService } from "../services/dictaminadoraService";

export function useDictaminadoras() {
  const [datos, setDatos] = useState<Dictaminadora[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [notificacion, setNotificacion] =
    useState<NotificacionDictaminadora | null>(null);

  const [montado, setMontado] = useState<boolean>(false);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const dbData = await dictaminadoraService.getAll();
      setDatos(dbData);
    } catch (err) {
      setNotificacion({
        tipo: "error",
        mensaje: "Error al sincronizar con el servidor de comisiones",
      });
      setDatos([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    setMontado(true); 
    cargarDatos();
  }, [cargarDatos]);

  const cerrarNotificacion = () => setNotificacion(null);

  const agregarRegistro = async (nuevaComision: Omit<Dictaminadora, "_id">) => {
    try {
      await dictaminadoraService.create(nuevaComision);
      setNotificacion({
        tipo: "success",
        mensaje: "Comisión registrada exitosamente",
      });
      cargarDatos();
    } catch (err) {
      setNotificacion({
        tipo: "error",
        mensaje:
          err instanceof Error ? err.message : "Error al agregar registro",
      });
    }
  };

  const editarRegistro = async (row: Dictaminadora) => {
    if (!row._id) return;
    try {
      await dictaminadoraService.update(row._id, row);
      setNotificacion({
        tipo: "success",
        mensaje: "Registro actualizado correctamente",
      });
      cargarDatos();
    } catch (err) {
      setNotificacion({
        tipo: "error",
        mensaje:
          err instanceof Error ? err.message : "Error al actualizar registro",
      });
    }
  };

  const eliminarRegistro = async (row: Dictaminadora) => {
    if (!row._id) return;
    try {
      await dictaminadoraService.delete(row._id);
      setNotificacion({
        tipo: "success",
        mensaje: "Comisión eliminada con éxito",
      });
      cargarDatos();
    } catch (err) {
      setNotificacion({
        tipo: "error",
        mensaje:
          err instanceof Error ? err.message : "Error al eliminar registro",
      });
    }
  };

  return {
    datos,
    loading: cargando || !montado,
    notificacion,
    cerrarNotificacion,
    agregarRegistro,
    editarRegistro,
    eliminarRegistro,
  };
}
