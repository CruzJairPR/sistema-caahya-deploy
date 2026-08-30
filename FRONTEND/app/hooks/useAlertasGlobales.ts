import { useState, useEffect, useCallback } from "react";

export interface Alerta {
  _id: string;
  rolDestino: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  referenciaId?: string;
  createdAt: string;
}

export function useAlertasGlobales(rolUsuario?: string) {
  const [notificaciones, setNotificaciones] = useState<Alerta[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const obtenerToken = () => localStorage.getItem("token") || "";

  // Usamos el rol que se le pase por parámetro, o leemos el de localStorage si existe
  const rolActivo =
    rolUsuario ||
    (typeof window !== "undefined" ? localStorage.getItem("userRole") : "") ||
    "";

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/alertas`;

  const cargarAlertas = useCallback(async () => {
    if (!rolActivo) return;
    try {
      setCargando(true);
      setError(null);

      const response = await fetch(`${API_URL}?rol=${rolActivo}`, {
        headers: {
          Authorization: `Bearer ${obtenerToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al obtener las alertas");

      const data = await response.json();
      setNotificaciones(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setCargando(false);
    }
  }, [API_URL, rolActivo]);

  useEffect(() => {
    cargarAlertas();
  }, [cargarAlertas]);

  // Función para posponer / marcar como leída la alerta en la BD
  const posponerNotificacion = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}/posponer`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${obtenerToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al posponer alerta");

      // Actualizamos el estado local quitando la alerta atendida de la campana
      setNotificaciones((prev) => prev.filter((item) => item._id !== id));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return {
    notificaciones,
    totalAlertas: notificaciones.length,
    tieneAlertasActivas: notificaciones.length > 0,
    cargando,
    error,
    posponerNotificacion,
    recargarAlertas: cargarAlertas,
  };
}
