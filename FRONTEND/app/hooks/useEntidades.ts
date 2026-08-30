import { useState, useEffect, useCallback } from "react";
import { EntidadDirectorio } from "../types/entidad";
import { entidadService } from "../services/entidadService";
import { useNotificacion } from "../context/NotificationContext";

const formatearDatosParaEnviar = (data: any) => {
  const resultado = { ...data };

  Object.keys(resultado).forEach((key) => {
    if (key.includes(".")) {
      const [parent, child] = key.split(".");
      resultado[parent] = {
        ...(resultado[parent] || {}),
        [child]: resultado[key],
      };
      delete resultado[key];
    }
  });

  return resultado;
};

export function useEntidades() {
  const [datos, setDatos] = useState<EntidadDirectorio[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Usamos el sistema global de notificaciones
  const { mostrarNotificacion } = useNotificacion();

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await entidadService.getAll();

      if (Array.isArray(respuesta)) {
        setDatos(respuesta);
      } else if (respuesta && typeof respuesta === "object") {
        if (
          "entidades" in respuesta &&
          Array.isArray((respuesta as any).entidades)
        ) {
          setDatos((respuesta as any).entidades);
        } else if (
          "data" in respuesta &&
          Array.isArray((respuesta as any).data)
        ) {
          setDatos((respuesta as any).data);
        } else {
          console.warn(
            "El backend no devolvió un formato de arreglo reconocible:",
            respuesta,
          );
          setDatos([]);
        }
      } else {
        setDatos([]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al conectar com el servidor",
      );
      setDatos([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Operación: Agregar
  const agregarEntidad = async (
    nuevaEntidad: Omit<EntidadDirectorio, "_id">,
  ) => {
    try {
      const entidadFormateada = formatearDatosParaEnviar(nuevaEntidad);
      const creada = await entidadService.create(entidadFormateada);

      const itemNuevo = (creada as any)?.data || creada;

      if (itemNuevo && itemNuevo._id) {
        setDatos((prev) => [...prev, itemNuevo]);
      } else {
        await cargarDatos();
      }

      mostrarNotificacion("Entidad añadida con éxito", "success");
    } catch (err: any) {
      console.error(err);
      mostrarNotificacion(
        err.message || "No se pudo añadir la entidad en el servidor",
        "error",
      );
    }
  };

  // Operación: Editar
  const editarEntidad = async (
    id: string,
    entidadActualizada: Partial<EntidadDirectorio>,
  ) => {
    try {
      const entidadFormateada = formatearDatosParaEnviar(entidadActualizada);
      const actualizada = await entidadService.update(id, entidadFormateada);
      const itemActualizado = (actualizada as any)?.data || actualizada;

      setDatos((prev) =>
        prev.map((item) => (item._id === id ? itemActualizado : item)),
      );
      mostrarNotificacion("Entidad modificada correctamente", "success");
    } catch (err: any) {
      console.error(err);
      mostrarNotificacion(
        err.message || "No se pudo modificar la entidad",
        "error",
      );
    }
  };

  const eliminarEntidad = async (id: string) => {
    try {
      await entidadService.delete(id);
      setDatos((prev) => prev.filter((item) => item._id !== id));
      mostrarNotificacion("Entidad eliminada con éxito", "success");
    } catch (err: any) {
      console.error(err);
      mostrarNotificacion(
        err.message || "No se pudo eliminar la entidad",
        "error",
      );
    }
  };

  return {
    datos,
    cargando,
    error,
    agregarEntidad,
    editarEntidad,
    eliminarEntidad,
  };
}
