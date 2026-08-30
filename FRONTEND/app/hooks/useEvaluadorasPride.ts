import { useState, useEffect, useCallback } from "react";
import { useNotificacion } from "../context/NotificationContext";

export interface EvaluadoraPride {
  _id?: string;
  numero?: number;
  entidad: string;
  fuenteDeDesignacion: string;
  tipoDeMiembro: string;
  miembro: string;
  adscripcion: string;
  categoriaYNivel: string;
  periodo: string;
  inicio: string;
  termino: string;
  permanencia: string;
  observaciones: string;
  preferenciasDeAreasCAAHyA: string;
  ultimaModificacion: string;
  miembroAnterior: string;
  [key: string]: unknown;
}

export function useEvaluadorasPride() {
  const [datos, setDatos] = useState<EvaluadoraPride[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { mostrarNotificacion } = useNotificacion();

  const base_api = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "";

  const API_URL = `${base_api}/api/v1/evaluadorasPride`;

  const mapearEvaluadora = (item: any): EvaluadoraPride => ({
    _id: item._id,
    numero: item.Número ?? item.numero,
    entidad: item.Entidad ?? item.entidad ?? "",
    fuenteDeDesignacion:
      item["Fuente de Designación"] ?? item.fuenteDeDesignacion ?? "",
    tipoDeMiembro: item["Tipo de Miembro"] ?? item.tipoDeMiembro ?? "",
    miembro: item.Miembro ?? item.miembro ?? "",
    adscripcion: item.Adscripción ?? item.adscripcion ?? "",
    categoriaYNivel: item["Categoría y nivel"] ?? item.categoriaYNivel ?? "",
    periodo: item.Periodo ?? item.periodo ?? "",
    inicio: item.Inicio ? item.Inicio.split("T")[0] : (item.inicio ?? ""),
    termino: item.Término ? item.Término.split("T")[0] : (item.termino ?? ""),
    permanencia: item.Permanencia ?? item.permanencia ?? "",
    observaciones: item.Observaciones ?? item.observaciones ?? "",
    preferenciasDeAreasCAAHyA:
      item["Prefencias de áreas CAAHyA"] ??
      item["Preferencias de áreas CAAHyA"] ??
      item.preferenciasDeAreasCAAHyA ??
      "",
    ultimaModificacion: item["Última modificación a la base"]
      ? item["Última modificación a la base"].split("T")[0]
      : (item.ultimaModificacion ?? ""),
    miembroAnterior: item["Miembro anterior"] ?? item.miembroAnterior ?? "",
  });

  const prepararDatosParaEnviar = (formData: any) => {
    return {
      Entidad: formData.entidad ?? formData.Entidad ?? "",
      "Fuente de Designación":
        formData.fuenteDeDesignacion ?? formData["Fuente de Designación"] ?? "",
      "Tipo de Miembro":
        formData.tipoDeMiembro ?? formData["Tipo de Miembro"] ?? "",
      Miembro: formData.miembro ?? formData.Miembro ?? "",
      Adscripción: formData.adscripcion ?? formData.Adscripción ?? "",
      "Categoría y nivel":
        formData.categoriaYNivel ?? formData["Categoría y nivel"] ?? "",
      Periodo: formData.periodo ?? formData.Periodo ?? "",
      Inicio: formData.inicio ? new Date(formData.inicio) : null,
      Término: formData.termino ? new Date(formData.termino) : null,
      Permanencia: formData.permanencia ?? formData.Permanencia ?? "",
      Observaciones: formData.observaciones ?? formData.Observaciones ?? "",
      "Prefencias de áreas CAAHyA":
        formData.preferenciasDeAreasCAAHyA ??
        formData["Prefencias de áreas CAAHyA"] ??
        null,
      "Última modificación a la base": formData.ultimaModificacion
        ? new Date(formData.ultimaModificacion)
        : null,
      "Miembro anterior":
        formData.miembroAnterior ?? formData["Miembro anterior"] ?? "",
    };
  };

  const obtenerEvaluadoras = useCallback(async () => {
    if (!base_api) {
      setCargando(false);
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const respuesta = await fetch(`${API_URL}?limit=200`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!respuesta.ok) {
        throw new Error(`Error en el servidor: ${respuesta.status}`);
      }

      const resultado = await respuesta.json();
      const listaCruda = resultado.data ?? resultado;

      const listaMapeada = Array.isArray(listaCruda)
        ? listaCruda.map(mapearEvaluadora)
        : [];

      setDatos(listaMapeada);
    } catch (err) {
      const mensaje =
        err instanceof Error
          ? err.message
          : "Error de red al cargar evaluadoras";
      setError(mensaje);
      setDatos([]);
    } finally {
      setCargando(false);
    }
  }, [API_URL, base_api]);

  useEffect(() => {
    obtenerEvaluadoras();
  }, [obtenerEvaluadoras]);

  const handleAdd = async (newRow: Record<string, any>) => {
    if (!base_api) return;
    try {
      const token = localStorage.getItem("token");
      const datosFormateados = prepararDatosParaEnviar(newRow);

      const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(datosFormateados),
      });
      const resultado = await respuesta.json();

      if (respuesta.ok) {
        mostrarNotificacion("Evaluadora agregada correctamente.", "success");
        obtenerEvaluadoras();
      } else {
        mostrarNotificacion(
          "Error del servidor: " + (resultado.message || "No se pudo crear"),
          "error",
        );
      }
    } catch (err) {
      console.error("Error al agregar evaluadora:", err);
      mostrarNotificacion(
        "Hubo un error de red al intentar agregar el registro.",
        "error",
      );
    }
  };

  const handleEdit = async (updatedRow: EvaluadoraPride) => {
    if (!base_api) return;
    if (!updatedRow._id) {
      mostrarNotificacion(
        "No se puede editar este registro porque carece de un ID válido.",
        "error",
      );
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const datosFormateados = prepararDatosParaEnviar(updatedRow);

      const respuesta = await fetch(`${API_URL}/${updatedRow._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(datosFormateados),
      });
      const resultado = await respuesta.json();

      if (respuesta.ok) {
        mostrarNotificacion("Cambios guardados con éxito.", "success");
        obtenerEvaluadoras();
      } else {
        mostrarNotificacion(
          "Error al actualizar: " + (resultado.message || "Error desconocido"),
          "error",
        );
      }
    } catch (err) {
      console.error("Error al actualizar evaluadora:", err);
      mostrarNotificacion(
        "Hubo un error de red al intentar guardar los cambios.",
        "error",
      );
    }
  };

  const handleDelete = async (rowToDelete: EvaluadoraPride) => {
    if (!base_api) return;
    if (!rowToDelete._id) {
      mostrarNotificacion(
        "No se puede eliminar el registro: falta el ID.",
        "error",
      );
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const respuesta = await fetch(`${API_URL}/${rowToDelete._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const resultado = await respuesta.json();

      if (respuesta.ok) {
        mostrarNotificacion("Evaluadora eliminada con éxito.", "success");
        obtenerEvaluadoras();
      } else {
        mostrarNotificacion(
          "Error al eliminar: " + (resultado.message || "Error desconocido"),
          "error",
        );
      }
    } catch (err) {
      console.error("Error al eliminar evaluadora:", err);
      mostrarNotificacion(
        "Hubo un error de red al intentar eliminar el registro.",
        "error",
      );
    }
  };

  return {
    datos,
    cargando,
    error,
    handleAdd,
    handleEdit,
    handleDelete,
  };
}
