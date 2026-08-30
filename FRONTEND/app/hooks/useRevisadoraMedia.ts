"use client";

import { useState, useEffect, useCallback, ChangeEvent } from "react";

const API_BASE = "http://localhost:5000/api/v1";
const MAX_FILE_SIZE_MB = 20;

const getHeaders = () => {
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }
  }
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

function archivoABase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function useRevisadoraMedia(endpoint: string) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [fechaArchivo, setFechaArchivo] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [archivosListado, setArchivosListado] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [notificacion, setNotificacion] = useState<any | null>(null);

  const [editandoId, setEditandoId] = useState<string | null>(null);

  const basePath = endpoint.split("?")[0];

  const cargarArchivos = useCallback(async () => {
    if (!endpoint) return;
    setCargando(true);
    try {
      const respuesta = await fetch(`${API_BASE}/${endpoint}`, {
        method: "GET",
        headers: getHeaders(),
      });
      const data = await respuesta.json();
      if (!respuesta.ok || data.success === false) {
        throw new Error(
          data.error || data.mensaje || "Error al obtener los registros.",
        );
      }
      setArchivosListado(
        Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [],
      );
    } catch (error: any) {
      setNotificacion({ tipo: "error", mensaje: error.message });
    } finally {
      setCargando(false);
    }
  }, [endpoint]);

  useEffect(() => {
    cargarArchivos();
  }, [cargarArchivos]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setNotificacion({
        tipo: "error",
        mensaje: `El archivo supera los ${MAX_FILE_SIZE_MB}MB.`,
      });
      return;
    }
    setArchivo(file);
  }, []);

  const handleStartEdit = useCallback((item: any) => {
    setEditandoId(item._id);
    setTitulo(item.titulo || "");
    setDescripcion(item.descripcion || "");
    setComentarios(item.comentarios || "");

    const rawFecha = item.fechaArchivo || item.fecha || item.date || "";
    setFechaArchivo(rawFecha ? rawFecha.split("T")[0] : "");

    setArchivo(null);
  }, []);

  const resetForm = useCallback(() => {
    setTitulo("");
    setDescripcion("");
    setComentarios("");
    setFechaArchivo("");
    setArchivo(null);
    setEditandoId(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!titulo.trim()) {
      setNotificacion({
        tipo: "warning",
        mensaje: "El campo Título es obligatorio.",
      });
      return;
    }

    setSubiendo(true);
    try {
      let archivoBase64 = undefined;
      let nombreArchivo = undefined;

      if (archivo) {
        archivoBase64 = await archivoABase64(archivo);
        nombreArchivo = archivo.name;
      }

      if (editandoId) {
        const payload: any = { titulo, descripcion, comentarios, fechaArchivo };
        if (archivoBase64 && nombreArchivo) {
          payload.archivoBase64 = archivoBase64;
          payload.nombreArchivo = nombreArchivo;
        }

        // Apunta a: /api/v1/carreras/:carrera/sesiones/:id o plan-trabajo
        const respuesta = await fetch(`${API_BASE}/${basePath}/${editandoId}`, {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok || data.success === false) {
          throw new Error(
            data.error || data.mensaje || "Error al actualizar el registro.",
          );
        }

        const registroActualizado = data.data || data;
        setArchivosListado((prev) =>
          prev.map((item) =>
            item._id === editandoId ? registroActualizado : item,
          ),
        );
        setNotificacion({
          tipo: "success",
          mensaje: "Actualizado exitosamente.",
        });
      } else {
        if (!archivo) {
          setNotificacion({
            tipo: "warning",
            mensaje: "Debes seleccionar un archivo para el nuevo registro.",
          });
          setSubiendo(false);
          return;
        }

        archivoBase64 = await archivoABase64(archivo);
        nombreArchivo = archivo.name;

        // Apunta directamente a: /api/v1/carreras/:carrera/sesiones o plan-trabajo
        const respuesta = await fetch(`${API_BASE}/${endpoint}`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            titulo,
            descripcion,
            comentarios,
            fechaArchivo,
            nombreArchivo,
            archivoBase64,
          }),
        });
        const data = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok || data.success === false) {
          throw new Error(
            data.error || data.mensaje || "Error al crear el registro.",
          );
        }

        const nuevoRegistro = data.data || data;
        setArchivosListado((prev) => [nuevoRegistro, ...prev]);
        setNotificacion({ tipo: "success", mensaje: "Guardado exitosamente." });
      }

      resetForm();
    } catch (error: any) {
      setNotificacion({ tipo: "error", mensaje: error.message });
    } finally {
      setSubiendo(false);
    }
  }, [
    titulo,
    descripcion,
    comentarios,
    fechaArchivo,
    archivo,
    editandoId,
    endpoint,
    basePath,
    resetForm,
  ]);

  const handleEliminar = useCallback(
    async (target: string | any) => {
      const id = typeof target === "string" ? target : target?._id;
      if (!id) return;

      try {
        // Apunta a: /api/v1/carreras/:carrera/sesiones/:id o plan-trabajo/:id
        const respuesta = await fetch(`${API_BASE}/${basePath}/${id}`, {
          method: "DELETE",
          headers: getHeaders(),
        });
        const data = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok || data.success === false) {
          throw new Error(
            data.error || data.mensaje || "Error al eliminar el registro.",
          );
        }

        setArchivosListado((prev) => prev.filter((item) => item._id !== id));
        setNotificacion({
          tipo: "success",
          mensaje: "Eliminado correctamente.",
        });
      } catch (error: any) {
        setNotificacion({ tipo: "error", mensaje: error.message });
      }
    },
    [basePath],
  );

  return {
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    comentarios,
    setComentarios,
    fechaArchivo,
    setFechaArchivo,
    archivo,
    setArchivo,
    archivosListado,
    cargando,
    subiendo,
    notificacion,
    setNotificacion,
    editandoId,
    handleFileChange,
    handleStartEdit,
    handleSubmit,
    handleEliminar,
    resetForm,
  };
}
