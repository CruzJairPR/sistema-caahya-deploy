import { useState, useEffect, useCallback } from "react";
import { Miembro } from "../types/miembros";

export function useMiembros() {
  const [datos, setDatos] = useState<Miembro[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notificacion, setNotificacion] = useState<{
    mensaje: string;
    tipo: "success" | "error";
  } | null>(null);

  const obtenerToken = () => localStorage.getItem("token") || "";

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/miembro`;

  const cargarMiembros = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${obtenerToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al obtener los miembros");

      const data = await response.json();
      setDatos(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setCargando(false);
    }
  }, [API_URL]);

  useEffect(() => {
    cargarMiembros();
  }, [cargarMiembros]);

  const handleAdd = async (nuevoRegistro: Record<string, any>) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${obtenerToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoRegistro),
      });

      if (!response.ok) throw new Error("Error al crear el miembro");

      const creado = await response.json();
      setDatos((prev) => [creado, ...prev]);
      setNotificacion({ mensaje: "Miembro creado con éxito", tipo: "success" });
    } catch (err: any) {
      setNotificacion({
        mensaje: err.message || "Error al crear",
        tipo: "error",
      });
    }
  };

  const handleEdit = async (registroEditado: Record<string, any>) => {
    try {
      const id = registroEditado._id || registroEditado.id;
      if (!id) throw new Error("No se encontró el ID del miembro a editar");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${obtenerToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registroEditado),
      });

      if (!response.ok) throw new Error("Error al actualizar el miembro");

      const actualizado = await response.json();

      // Actualizamos el estado local de manera limpia
      setDatos((prev) =>
        prev.map((item) =>
          item._id === id || (item as any).id === id ? actualizado : item,
        ),
      );

      setNotificacion({
        mensaje: "Miembro actualizado con éxito",
        tipo: "success",
      });
    } catch (err: any) {
      setNotificacion({
        mensaje: err.message || "Error al actualizar",
        tipo: "error",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${obtenerToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al eliminar el miembro");

      // Filtramos el estado local para remover el elemento eliminado
      setDatos((prev) =>
        prev.filter((item) => item._id !== id && (item as any).id !== id),
      );

      setNotificacion({
        mensaje: "Miembro eliminado con éxito",
        tipo: "success",
      });
    } catch (err: any) {
      setNotificacion({
        mensaje: err.message || "Error al eliminar",
        tipo: "error",
      });
    }
  };

  const cerrarNotificacion = () => setNotificacion(null);

  return {
    datos,
    cargando,
    error,
    notificacion,
    cerrarNotificacion,
    handleAdd,
    handleEdit,
    handleDelete,
    recargar: cargarMiembros,
  };
}
