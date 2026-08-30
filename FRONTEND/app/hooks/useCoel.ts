import { useState, useEffect, useCallback } from "react";
import { coelService, MiembroCoel } from "../services/coelService";

export function useCoel() {
  const [datos, setDatos] = useState<MiembroCoel[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  const cargarMiembros = useCallback(async () => {
    try {
      const miembros = await coelService.obtenerTodos();
      setDatos(miembros);
    } catch (error) {
      console.error("🚨 Error en useCoel de carga:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const apiConfigurada = !!process.env.NEXT_PUBLIC_API_URL;
    if (apiConfigurada) {
      cargarMiembros();
    } else {
      console.error("🚨 La variable NEXT_PUBLIC_API_URL no está definida.");
      setCargando(false);
    }
  }, [cargarMiembros]);

  const agregarMiembro = async (newRow: Record<string, string>) => {
    try {
      await coelService.crear(newRow);
      alert("Miembro agregado a la comisión COEL con éxito.");
      await cargarMiembros();
    } catch (error: any) {
      console.error("Error al agregar:", error);
      alert(
        error.message ||
          "Hubo un error de red al intentar agregar el registro.",
      );
    }
  };

  const editarMiembro = async (updatedRow: MiembroCoel) => {
    if (!updatedRow._id) {
      alert("No se puede editar este registro porque carece de un ID válido.");
      return;
    }
    try {
      await coelService.actualizar(updatedRow._id, updatedRow);
      alert("Cambios guardados con éxito en la comisión COEL.");
      await cargarMiembros();
    } catch (error: any) {
      console.error("Error al actualizar:", error);
      alert(
        error.message ||
          "Hubo un error de red al intentar guardar los cambios.",
      );
    }
  };

  const eliminarMiembro = async (rowToDelete: MiembroCoel) => {
    if (!rowToDelete._id) {
      alert(
        "No se puede eliminar el registro debido a la falta de un ID válido.",
      );
      return;
    }
    try {
      await coelService.eliminar(rowToDelete._id);
      alert("Miembro eliminado de la comisión COEL con éxito.");
      await cargarMiembros();
    } catch (error: any) {
      console.error("Error al eliminar:", error);
      alert(
        error.message ||
          "Hubo un error de red al intentar eliminar el registro.",
      );
    }
  };

  return {
    datos,
    cargando,
    agregarMiembro,
    editarMiembro,
    eliminarMiembro,
  };
}
