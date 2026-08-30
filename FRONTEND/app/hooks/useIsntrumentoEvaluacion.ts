"use client";

import { useState, useEffect, useCallback, ChangeEvent } from "react";
import type {
  InstrumentoEvaluacion,
  NotificacionState,
} from "../types/instrumentoEvaluacion";
import {
  fetchInstrumentos,
  crearInstrumento,
  eliminarInstrumento,
} from "../services/instrumentoEvaluacionService";

const MAX_FILE_SIZE_MB = 10;

function archivoABase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function useInstrumentosEvaluacion() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [instrumentos, setInstrumentos] = useState<InstrumentoEvaluacion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [notificacion, setNotificacion] = useState<NotificacionState | null>(
    null,
  );

  const cargarInstrumentos = useCallback(async () => {
    setCargando(true);
    try {
      const datos = await fetchInstrumentos();
      setInstrumentos(datos);
    } catch {
      setNotificacion({
        tipo: "error",
        mensaje: "No se pudieron cargar los instrumentos.",
      });
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarInstrumentos();
  }, [cargarInstrumentos]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mimesPermitidos = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const extensionesPermitidas = ["pdf", "doc", "docx", "xls", "xlsx"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

    const esMimeValido = mimesPermitidos.includes(file.type);
    const esExtensionValida = extensionesPermitidas.includes(fileExtension);

    if (!esMimeValido && !esExtensionValida) {
      setNotificacion({
        tipo: "error",
        mensaje: "Solo se permiten archivos de Word, Excel o PDF.",
      });
      return;
    }

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
          "Por favor, completa todos los campos y selecciona un archivo válido.",
      });
      return;
    }

    setSubiendo(true);
    try {
      const archivoBase64 = await archivoABase64(archivo);
      const nuevo = await crearInstrumento({
        titulo,
        descripcion,
        nombreArchivo: archivo.name,
        archivoBase64,
      });

      setInstrumentos((prev) => [nuevo, ...prev]);
      setNotificacion({
        tipo: "success",
        mensaje: "Archivo subido exitosamente.",
      });
      setTitulo("");
      setDescripcion("");
      setArchivo(null);
    } catch {
      setNotificacion({ tipo: "error", mensaje: "Error al subir el archivo." });
    } finally {
      setSubiendo(false);
    }
  }, [titulo, descripcion, archivo]);

  const handleEliminar = useCallback(async (id: string) => {
    try {
      await eliminarInstrumento(id);
      setInstrumentos((prev) => prev.filter((doc) => doc._id !== id));
      setNotificacion({ tipo: "success", mensaje: "Instrumento eliminado." });
    } catch {
      setNotificacion({
        tipo: "error",
        mensaje: "Error al eliminar el instrumento.",
      });
    }
  }, []);

  return {
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    archivo,
    instrumentos,
    cargando,
    subiendo,
    notificacion,
    setNotificacion,
    handleFileChange,
    handleSubmit,
    handleEliminar,
  };
}
