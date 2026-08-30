import { useState, useEffect, useCallback } from "react";
import { difusionService, MiembroDifusion } from "../services/difusionService";

export interface NotificationState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

export function useDifusion() {
  const [datos, setDatos] = useState<MiembroDifusion[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  // Estado para la alerta de Material UI
  const [notificacion, setNotificacion] = useState<NotificationState>({
    open: false,
    message: "",
    severity: "success",
  });

  const cerrarNotificacion = () => {
    setNotificacion((prev) => ({ ...prev, open: false }));
  };

  const mostrarNotificacion = (
    message: string,
    severity: NotificationState["severity"],
  ) => {
    setNotificacion({ open: true, message, severity });
  };

  const cargarMiembros = useCallback(async () => {
    try {
      const miembros = await difusionService.obtenerTodos();
      setDatos(miembros);
    } catch (error) {
      console.error("🚨 Error en useDifusion de carga:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_URL) {
      cargarMiembros();
    } else {
      console.error("🚨 La variable NEXT_PUBLIC_API_URL no está definida.");
      setCargando(false);
    }
  }, [cargarMiembros]);

  const agregarMiembro = async (newRow: Record<string, string>) => {
    try {
      // 1. Enviamos la petición al backend
      await difusionService.crear(newRow);
      mostrarNotificacion(
        "Registro agregado a Difusión y Extensión con éxito.",
        "success",
      );

      await cargarMiembros();
    } catch (error: any) {
      console.error("Error al agregar:", error);
      mostrarNotificacion(
        error.message || "Hubo un error al intentar agregar el registro.",
        "error",
      );
    }
  };

  const editarMiembro = async (updatedRow: MiembroDifusion) => {
    if (!updatedRow._id) {
      mostrarNotificacion(
        "No se puede editar este registro porque no cuenta con un ID válido.",
        "error",
      );
      return;
    }
    try {
      await difusionService.actualizar(updatedRow._id, updatedRow);
      mostrarNotificacion(
        "Cambios guardados con éxito en la base de datos.",
        "success",
      );

      // Actualización optimista en el estado para que se pinte en la tabla al instante
      setDatos((prevDatos) =>
        prevDatos.map((item) =>
          item._id === updatedRow._id ? updatedRow : item,
        ),
      );
    } catch (error: any) {
      console.error("Error al actualizar:", error);
      mostrarNotificacion(
        error.message || "Hubo un error al intentar guardar los cambios.",
        "error",
      );
    }
  };

  const eliminarMiembro = async (rowToDelete: MiembroDifusion) => {
    if (!rowToDelete._id) {
      mostrarNotificacion(
        "No se puede eliminar este registro debido a la falta de un ID.",
        "error",
      );
      return;
    }
    try {
      await difusionService.eliminar(rowToDelete._id);
      mostrarNotificacion(
        "Registro eliminado permanentemente de la comisión.",
        "success",
      );

      // Filtramos directamente del estado para quitarlo de la pantalla de inmediato
      setDatos((prevDatos) =>
        prevDatos.filter((item) => item._id !== rowToDelete._id),
      );
    } catch (error: any) {
      console.error("Error al eliminar:", error);
      mostrarNotificacion(
        error.message || "Hubo un error al intentar eliminar el registro.",
        "error",
      );
    }
  };

  return {
    datos,
    cargando,
    notificacion,
    agregarMiembro,
    editarMiembro,
    eliminarMiembro,
    cerrarNotificacion,
  };
}
