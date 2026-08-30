import { useState, useEffect, useCallback } from "react";
import { useNotificacion } from "../context/NotificationContext";

export function usePride<T>(subrutaApi: string) {
  const [datos, setDatos] = useState<T[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  const { mostrarNotificacion } = useNotificacion();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const endpointUrl = `${baseUrl}/api/v1/${subrutaApi}`;

  const obtenerDatos = useCallback(async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const respuesta = await fetch(endpointUrl, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!respuesta.ok) throw new Error("Error en el servidor");

      const resultado = await respuesta.json();
      setDatos(resultado.data || resultado.rows || resultado);
    } catch (error) {
      mostrarNotificacion("Error al cargar los datos", "error");
    } finally {
      setCargando(false);
    }
  }, [endpointUrl, mostrarNotificacion]);

  useEffect(() => {
    obtenerDatos();
  }, [obtenerDatos]);

  const agregarRegistro = async (nuevoRegistro: any) => {
    try {
      const token = localStorage.getItem("token");
      const respuesta = await fetch(endpointUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(nuevoRegistro),
      });

      const data = await respuesta.json();
      if (!respuesta.ok) {
        throw new Error(data.message || data.error || "Error al crear");
      }

      setDatos((prev) => [...prev, data.data || data]);
      mostrarNotificacion("Creado con éxito", "success");
    } catch (error) {
      mostrarNotificacion(
        error instanceof Error ? error.message : "Error al crear",
        "error",
      );
    }
  };

  const editarRegistro = async (id: string, datosActualizados: any) => {
    try {
      const token = localStorage.getItem("token");
      const {
        _id,
        __v,
        createdAt,
        updatedAt,
        urgencia,
        id: aliasId,
        ...datosLimpios
      } = datosActualizados;

      const respuesta = await fetch(`${endpointUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(datosLimpios),
      });

      if (!respuesta.ok) {
        const errData = await respuesta.json().catch(() => ({}));
        throw new Error(errData.message || "Error al actualizar");
      }

      const resultado = await respuesta.json();
      const dataBackend = resultado.data || resultado.rows || resultado;

      setDatos((prev) =>
        prev.map((item: any) => {
          const itemId = item._id?.toString() || item.id?.toString();
          if (itemId === id) {
            return {
              ...item,
              ...(typeof dataBackend === "object" ? dataBackend : {}),
              ...datosLimpios,
            };
          }
          return item;
        }),
      );

      mostrarNotificacion("Actualizado correctamente", "success");
    } catch (error) {
      mostrarNotificacion(
        error instanceof Error ? error.message : "Error al actualizar",
        "error",
      );
    }
  };

  const eliminarRegistro = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const respuesta = await fetch(`${endpointUrl}/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!respuesta.ok) throw new Error("Error al eliminar");

      setDatos((prev) => prev.filter((item: any) => item._id !== id));
      mostrarNotificacion("Eliminado correctamente", "success");
    } catch (error) {
      mostrarNotificacion("Error al eliminar", "error");
    }
  };

  return {
    datos,
    cargando,
    agregarRegistro,
    editarRegistro,
    eliminarRegistro,
  };
}
