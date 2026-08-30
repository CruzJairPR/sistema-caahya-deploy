"use client";

import { useState, useEffect, useCallback, ChangeEvent } from "react";
import type { MediaDocumento, NotificacionMediaState } from "../types/media";
import {
  fetchMedia,
  crearMedia,
  actualizarMedia,
  eliminarMedia,
} from "../services/mediaService";
import {
  fetchSesionesRevisadora,
  crearSesionRevisadora,
  actualizarSesionRevisadora,
  eliminarSesionRevisadora,
} from "../services/sesionesRevisadoraService";
import {
  fetchFolios,
  crearFolio,
  actualizarFolio,
  eliminarFolio,
} from "../services/foliosService";

const MAX_FILE_SIZE_MB = 20;

function archivoABase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

interface UseMediaOptions {
  formatoPorDefecto?: string;
  usarSesionesService?: boolean;
  usarFoliosService?: boolean;
}

export function useMedia(options: string | UseMediaOptions = "documento") {
  const formatoPorDefecto =
    typeof options === "string"
      ? options
      : options.formatoPorDefecto || "documento";
  const usarSesionesService =
    typeof options === "object" ? options.usarSesionesService : false;
  const usarFoliosService =
    typeof options === "object" ? options.usarFoliosService : false;

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [archivosListado, setArchivosListado] = useState<MediaDocumento[]>([]);
  const [cargando, setCargando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [notificacion, setNotificacion] =
    useState<NotificacionMediaState | null>(null);

  const [idEditando, setIdEditando] = useState<string | null>(null);
  const [archivoBase64Existente, setArchivoBase64Existente] = useState<
    string | null
  >(null);
  const [nombreArchivoExistente, setNombreArchivoExistente] = useState<
    string | null
  >(null);

  const cargarArchivos = useCallback(async () => {
    setCargando(true);
    try {
      const datos = usarSesionesService
        ? await fetchSesionesRevisadora()
        : usarFoliosService
          ? await fetchFolios()
          : await fetchMedia();
      setArchivosListado(datos);
    } catch {
      setNotificacion({
        tipo: "error",
        mensaje: "No se pudieron cargar los registros desde el servidor.",
      });
    } finally {
      setCargando(false);
    }
  }, [usarSesionesService, usarFoliosService]);

  useEffect(() => {
    cargarArchivos();
  }, [cargarArchivos]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mimesPermitidos = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/png",
      "image/jpeg",
    ];
    const extensionesPermitidas = [
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "png",
      "jpg",
    ];
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

    const esMimeValido = mimesPermitidos.includes(file.type);
    const esExtensionValida = extensionesPermitidas.includes(fileExtension);

    if (!esMimeValido && !esExtensionValida) {
      setNotificacion({
        tipo: "error",
        mensaje:
          "Formato no válido. Solo se permite Word, Excel, PDF o Imágenes.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setNotificacion({
        tipo: "error",
        mensaje: `El archivo supera el límite permitido de ${MAX_FILE_SIZE_MB}MB.`,
      });
      return;
    }

    setArchivo(file);
  }, []);

  const handleEdit = useCallback((item: any) => {
    setIdEditando(item._id);
    setTitulo(item.titulo || "");
    setDescripcion(item.descripcion || "");
    setArchivo(null);
    setArchivoBase64Existente(item.archivoBase64 || null);
    setNombreArchivoExistente(item.nombreArchivo || null);
  }, []);

  const cancelarEdicion = useCallback(() => {
    setIdEditando(null);
    setTitulo("");
    setDescripcion("");
    setArchivo(null);
    setArchivoBase64Existente(null);
    setNombreArchivoExistente(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    const hayArchivo = archivo || archivoBase64Existente;

    if (!titulo.trim() || !descripcion.trim() || !hayArchivo) {
      setNotificacion({
        tipo: "warning",
        mensaje: "Por favor, rellena todos los campos obligatorios.",
      });
      return;
    }

    setSubiendo(true);
    try {
      let archivoBase64 = archivoBase64Existente || "";
      let nombreArchivo = nombreArchivoExistente || "";

      if (archivo) {
        archivoBase64 = await archivoABase64(archivo);
        nombreArchivo = archivo.name;
      }

      const payload = {
        titulo,
        descripcion,
        nombreArchivo,
        archivoBase64,
        tipo: formatoPorDefecto,
        tipoFormato: formatoPorDefecto,
      };

      let registroGuardado: any;

      if (idEditando) {
        registroGuardado = usarSesionesService
          ? await actualizarSesionRevisadora(idEditando, payload)
          : usarFoliosService
            ? await actualizarFolio(idEditando, payload)
            : await actualizarMedia(idEditando, payload);

        setArchivosListado((prev) =>
          prev.map((item) =>
            item._id === idEditando ? registroGuardado : item,
          ),
        );
        setNotificacion({
          tipo: "success",
          mensaje: "Registro actualizado exitosamente.",
        });
      } else {
        registroGuardado = usarSesionesService
          ? await crearSesionRevisadora(payload)
          : usarFoliosService
            ? await crearFolio(payload)
            : await crearMedia(payload);

        setArchivosListado((prev) => [registroGuardado, ...prev]);
        setNotificacion({
          tipo: "success",
          mensaje: "Archivo guardado exitosamente.",
        });
      }

      setTitulo("");
      setDescripcion("");
      setArchivo(null);
      setIdEditando(null);
      setArchivoBase64Existente(null);
      setNombreArchivoExistente(null);
    } catch (error: any) {
      setNotificacion({
        tipo: "error",
        mensaje: error.message || "Ocurrió un error al guardar el archivo.",
      });
    } finally {
      setSubiendo(false);
    }
  }, [
    titulo,
    descripcion,
    archivo,
    formatoPorDefecto,
    usarSesionesService,
    usarFoliosService,
    idEditando,
    archivoBase64Existente,
    nombreArchivoExistente,
  ]);

  const handleEliminar = useCallback(
    async (id: string) => {
      try {
        if (usarSesionesService) {
          await eliminarSesionRevisadora(id);
        } else if (usarFoliosService) {
          await eliminarFolio(id);
        } else {
          await eliminarMedia(id);
        }

        setArchivosListado((prev) => prev.filter((item) => item._id !== id));
        setNotificacion({
          tipo: "success",
          mensaje: "Registro eliminado correctamente.",
        });
      } catch {
        setNotificacion({
          tipo: "error",
          mensaje: "No se pudo eliminar el archivo del servidor.",
        });
      }
    },
    [usarSesionesService, usarFoliosService],
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
    handleFileChange,
    handleSubmit,
    handleEliminar,
    idEditando,
    nombreArchivoExistente,
    handleEdit,
    cancelarEdicion,
  };
}
