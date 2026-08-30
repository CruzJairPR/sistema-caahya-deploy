// hooks/useActas.ts
"use client";

import { useState, useEffect, useCallback, useRef, ChangeEvent } from "react";
import type { ActaDocumento, NotificacionActaState } from "../types/actas";
import {
  fetchActas,
  crearActa,
  actualizarActa,
  eliminarActa,
} from "../services/actasService";

const MAX_FILE_SIZE_MB = 20;

const MIMES_PERMITIDOS = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
];

const EXTENSIONES_PERMITIDAS = ["pdf", "doc", "docx", "xls", "xlsx", "png", "jpg"];

function archivoABase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

type PayloadActualizarActa = Partial<
  Pick<ActaDocumento, "titulo" | "descripcion" | "tipo" | "archivoBase64" | "nombreArchivo">
>;

export function useActas(tipoActa: string = "acta") {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const [archivosListado, setArchivosListado] = useState<ActaDocumento[]>([]);
  const [cargando, setCargando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [notificacion, setNotificacion] =
    useState<NotificacionActaState | null>(null);

  const montadoRef = useRef(true);
  useEffect(() => {
    montadoRef.current = true;
    return () => {
      montadoRef.current = false;
    };
  }, []);

  const cargarArchivos = useCallback(async () => {
    setCargando(true);
    try {
      const datos = await fetchActas(tipoActa);
      if (!montadoRef.current) return;
      setArchivosListado(datos);
    } catch {
      if (!montadoRef.current) return;
      setNotificacion({
        tipo: "error",
        mensaje: "No se pudieron cargar las actas desde el servidor.",
      });
    } finally {
      if (montadoRef.current) setCargando(false);
    }
  }, [tipoActa]);

  useEffect(() => {
    cargarArchivos();
  }, [cargarArchivos]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

    if (
      !MIMES_PERMITIDOS.includes(file.type) &&
      !EXTENSIONES_PERMITIDAS.includes(fileExtension)
    ) {
      setNotificacion({
        tipo: "error",
        mensaje: "Formato no válido. Solo se permite Word, Excel, PDF o Imágenes.",
      });
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setNotificacion({
        tipo: "error",
        mensaje: `El archivo supera el límite permitido de ${MAX_FILE_SIZE_MB}MB.`,
      });
      e.target.value = "";
      return;
    }

    setArchivo(file);
  }, []);

  const iniciarEdicion = (acta: ActaDocumento) => {
    setEditandoId(acta._id);
    setTitulo(acta.titulo);
    setDescripcion(acta.descripcion);
    setArchivo(null);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setTitulo("");
    setDescripcion("");
    setArchivo(null);
  };

  const handleSubmit = useCallback(async () => {
    if (!titulo.trim() || !descripcion.trim()) {
      setNotificacion({
        tipo: "warning",
        mensaje: "Por favor, rellena los campos obligatorios de título y descripción.",
      });
      return;
    }

    if (!editandoId && !archivo) {
      setNotificacion({
        tipo: "warning",
        mensaje: "Debes seleccionar un archivo para la nueva acta.",
      });
      return;
    }

    setSubiendo(true);
    try {
      let archivoBase64: string | undefined;
      if (archivo) {
        archivoBase64 = await archivoABase64(archivo);
      }

      if (editandoId) {
        const payloadActualizado: PayloadActualizarActa = {
          titulo,
          descripcion,
          tipo: tipoActa,
        };
        if (archivoBase64) {
          payloadActualizado.archivoBase64 = archivoBase64;
          payloadActualizado.nombreArchivo = archivo?.name;
        }

        const actaActualizada = await actualizarActa(editandoId, payloadActualizado);
        if (!montadoRef.current) return;
        setArchivosListado((prev) =>
          prev.map((item) => (item._id === editandoId ? actaActualizada : item)),
        );
        setNotificacion({ tipo: "success", mensaje: "Acta actualizada correctamente." });
      } else {
        const nuevoRegistro = await crearActa({
          titulo,
          descripcion,
          nombreArchivo: archivo!.name,
          archivoBase64: archivoBase64!,
          tipo: tipoActa,
        });

        if (!montadoRef.current) return;
        setArchivosListado((prev) => [nuevoRegistro, ...prev]);
        setNotificacion({ tipo: "success", mensaje: "Acta guardada exitosamente." });
      }

      cancelarEdicion();
    } catch (error: any) {
      if (!montadoRef.current) return;
      setNotificacion({
        tipo: "error",
        mensaje: error.message || "Ocurrió un error al procesar el acta.",
      });
    } finally {
      if (montadoRef.current) setSubiendo(false);
    }
  }, [titulo, descripcion, archivo, editandoId, tipoActa]);

  const handleEliminar = useCallback(async (id: string) => {
    try {
      await eliminarActa(id);
      if (!montadoRef.current) return;
      setArchivosListado((prev) => prev.filter((item) => item._id !== id));
      setNotificacion({ tipo: "success", mensaje: "Acta eliminada correctamente." });
    } catch {
      if (!montadoRef.current) return;
      setNotificacion({
        tipo: "error",
        mensaje: "No se pudo eliminar el acta del servidor.",
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
    editandoId,
    iniciarEdicion,
    cancelarEdicion,
    handleFileChange,
    handleSubmit,
    handleEliminar,
  };
}