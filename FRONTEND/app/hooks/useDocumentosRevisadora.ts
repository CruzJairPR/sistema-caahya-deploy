"use client";

import { useState, useEffect, useCallback, useRef, ChangeEvent } from "react";
import type {
  SesionDocumento,
  NotificacionSesionState,
} from "../types/sesiones";
import {
  fetchSesionesRevisadora,
  crearSesionRevisadora,
  actualizarSesionRevisadora,
  eliminarSesionRevisadora,
} from "../services/sesionesRevisadoraService";
import {
  documentosRevisadora,
  type DocumentoRevisadoraKey,
} from "../config/documentosRevisadora";

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

const EXTENSIONES_PERMITIDAS = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "png",
  "jpg",
];

function archivoABase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

type PayloadActualizarSesion = Partial<
  Pick<
    SesionDocumento,
    "titulo" | "descripcion" | "tipo" | "archivoBase64" | "nombreArchivo"
  >
>;

export function useDocumentosRevisadora(tipo: DocumentoRevisadoraKey) {
  const config = documentosRevisadora[tipo];

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const [archivosListado, setArchivosListado] = useState<SesionDocumento[]>([]);
  const [cargando, setCargando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [notificacion, setNotificacion] =
    useState<NotificacionSesionState | null>(null);

  // Flag de cleanup para evitar setState tras desmontar / condición de carrera en Strict Mode
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
      const datos = await fetchSesionesRevisadora(tipo);
      if (!montadoRef.current) return;
      setArchivosListado(datos);
    } catch {
      if (!montadoRef.current) return;
      setNotificacion({
        tipo: "error",
        mensaje: `No se pudieron cargar las ${config.nombrePlural} desde el servidor.`,
      });
    } finally {
      if (montadoRef.current) setCargando(false);
    }
  }, [tipo, config.nombrePlural]);

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
        mensaje:
          "Formato no válido. Solo se permite Word, Excel, PDF o Imágenes.",
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

  const iniciarEdicion = (documento: SesionDocumento) => {
    setEditandoId(documento._id);
    setTitulo(documento.titulo);
    setDescripcion(documento.descripcion);
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
        mensaje:
          "Por favor, rellena los campos obligatorios de título y descripción.",
      });
      return;
    }

    if (!editandoId && !archivo) {
      setNotificacion({
        tipo: "warning",
        mensaje: `Debes seleccionar un archivo para la nueva ${config.nombreSingular}.`,
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
        const payloadActualizado: PayloadActualizarSesion = {
          titulo,
          descripcion,
          tipo,
        };
        if (archivoBase64) {
          payloadActualizado.archivoBase64 = archivoBase64;
          payloadActualizado.nombreArchivo = archivo?.name;
        }

        await actualizarSesionRevisadora(editandoId, payloadActualizado);

        if (!montadoRef.current) return;
        setNotificacion({
          tipo: "success",
          mensaje: `${config.nombreSingularCapitalizado} actualizada correctamente.`,
        });
      } else {
        await crearSesionRevisadora({
          titulo,
          descripcion,
          nombreArchivo: archivo!.name,
          archivoBase64: archivoBase64!,
          tipo,
        });

        if (!montadoRef.current) return;
        setNotificacion({
          tipo: "success",
          mensaje: `${config.nombreSingularCapitalizado} guardada exitosamente.`,
        });
      }

      // Limpiar formulario y recargar datos frescos directamente del servidor
      cancelarEdicion();
      await cargarArchivos(); // <-- ESTO ASEGURA QUE LA TABLA SE ACTUALICE CORRECTAMENTE
    } catch (error: any) {
      if (!montadoRef.current) return;
      setNotificacion({
        tipo: "error",
        mensaje:
          error.message ||
          `Ocurrió un error al procesar la ${config.nombreSingular}.`,
      });
    } finally {
      if (montadoRef.current) setSubiendo(false);
    }
  }, [titulo, descripcion, archivo, editandoId, tipo, config, cargarArchivos]);

  const handleEliminar = useCallback(
    async (id: string) => {
      try {
        await eliminarSesionRevisadora(id);
        if (!montadoRef.current) return;
        setArchivosListado((prev) => prev.filter((item) => item._id !== id));
        setNotificacion({
          tipo: "success",
          mensaje: `${config.nombreSingularCapitalizado} eliminada correctamente.`,
        });
      } catch {
        if (!montadoRef.current) return;
        setNotificacion({
          tipo: "error",
          mensaje: `No se pudo eliminar la ${config.nombreSingular} del servidor.`,
        });
      }
    },
    [config],
  );

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
