"use client";

import { useState, useEffect, useCallback, ChangeEvent } from "react";
import type {
  SesionDocumento,
  NotificacionSesionState,
} from "../types/sesiones";
import {
  fetchSesionesRevisadora,
  crearSesionRevisadora,
  eliminarSesionRevisadora,
} from "../services/sesionesRevisadoraService";

const MAX_FILE_SIZE_MB = 20;

function archivoABase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function useSesionesRevisadora() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [archivosListado, setArchivosListado] = useState<SesionDocumento[]>([]);
  const [cargando, setCargando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [notificacion, setNotificacion] =
    useState<NotificacionSesionState | null>(null);

  const cargarArchivos = useCallback(async () => {
    setCargando(true);
    try {
      const datos = await fetchSesionesRevisadora();
      setArchivosListado(Array.isArray(datos) ? datos : []);
    } catch (error: any) {
      setNotificacion({
        tipo: "error",
        mensaje: error.message || "Error al cargar los registros.",
      });
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarArchivos();
  }, [cargarArchivos]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setNotificacion({
        tipo: "error",
        mensaje: `El archivo supera el límite de ${MAX_FILE_SIZE_MB}MB.`,
      });
      return;
    }

    setArchivo(file);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!titulo.trim() || !descripcion.trim() || !archivo) {
      setNotificacion({
        tipo: "warning",
        mensaje:
          "Por favor, completa todos los campos y selecciona un archivo.",
      });
      return;
    }

    setSubiendo(true);
    try {
      const archivoBase64 = await archivoABase64(archivo);

      const nuevoRegistro = await crearSesionRevisadora({
        titulo,
        descripcion,
        nombreArchivo: archivo.name,
        archivoBase64,
      });

      setArchivosListado((prev) => [nuevoRegistro, ...prev]);
      setNotificacion({
        tipo: "success",
        mensaje: "Sesión guardada exitosamente.",
      });

      setTitulo("");
      setDescripcion("");
      setArchivo(null);
    } catch (error: any) {
      setNotificacion({
        tipo: "error",
        mensaje: error.message || "Ocurrió un error al guardar.",
      });
    } finally {
      setSubiendo(false);
    }
  }, [titulo, descripcion, archivo]);

  const handleEliminar = useCallback(async (id: string) => {
    try {
      await eliminarSesionRevisadora(id);
      setArchivosListado((prev) => prev.filter((item) => item._id !== id));
      setNotificacion({
        tipo: "success",
        mensaje: "Sesión eliminada correctamente.",
      });
    } catch (error: any) {
      setNotificacion({
        tipo: "error",
        mensaje: error.message || "No se pudo eliminar el registro.",
      });
    }
  }, []);

  return {
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    archivo,
    archivosListado,
    cargando,
    subiendo,
    notificacion,
    setNotificacion,
    handleFileChange,
    handleSubmit,
    handleEliminar,
  };
}
