import { ComisionPermanenteReg } from "../types/comisionPermanente";

const base_api = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "";

const API_URL = `${base_api}/api/v1/permanente`;

export const comisionPermanenteService = {
  // GET ALL
  async getAll(): Promise<ComisionPermanenteReg[]> {
    if (!base_api) throw new Error("API URL no configurada.");

    const respuesta = await fetch(API_URL, { cache: "no-store" });
    if (!respuesta.ok) throw new Error("Error al obtener las comisiones.");

    const resultado = await respuesta.json();
    const lista = resultado.data ?? resultado;

    if (!Array.isArray(lista)) return [];

    return lista.map((item: any) => ({
      _id: item._id?.$oid ?? item._id,
      Número: Number(item.Número ?? item.numero ?? 0),
      Entidad: item.Entidad ?? item.entidad ?? "",
      Comisión: item.Comisión ?? item.comision ?? "",
      "Fuente de Designación":
        item["Fuente de Designación"] ?? item.fuenteDeDesignacion ?? "",
      Miembro: item.Miembro ?? item.miembro ?? "",
      Adscripción: item.Adscripción ?? item.adscripcion ?? "",
      "Categoría y nivel":
        item["Categoría y nivel"] ?? item.categoriaNivel ?? null,
      Periodo: item.Periodo ?? item.periodo ?? "",
      Inicio: item.Inicio ?? item.inicio ?? "",
      Término: item.Término ?? item.termino ?? "",
      Permanencia: item.Permanencia ?? item.permanence ?? null,
      Observaciones: item.Observaciones ?? item.observaciones ?? null,
      "Miembro anterior":
        item["Miembro anterior"] ?? item.miembroAnterior ?? null,
    }));
  },

  // CREATE
  async create(newRow: Record<string, any>): Promise<void> {
    if (!base_api) throw new Error("API URL no configurada.");

    // Convertimos explícitamente el número para guardarlo limpio en Mongo
    const dataToSend = {
      ...newRow,
      Número: Number(newRow.Número ?? newRow.numero ?? 1),
    };

    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (!respuesta.ok) {
      const resultado = await respuesta.json();
      throw new Error(
        resultado.error || resultado.message || "Error al crear el registro.",
      );
    }
  },

  // UPDATE
  async update(updatedRow: ComisionPermanenteReg): Promise<void> {
    if (!base_api) throw new Error("API URL no configurada.");

    const respuesta = await fetch(`${API_URL}/${updatedRow._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRow),
    });

    if (!respuesta.ok) {
      const resultado = await respuesta.json();
      throw new Error(
        resultado.error ||
          resultado.message ||
          "Error al actualizar el registro.",
      );
    }
  },

  // DELETE
  async delete(id: string): Promise<void> {
    if (!base_api) throw new Error("API URL no configurada.");

    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!respuesta.ok) {
      const resultado = await respuesta.json();
      throw new Error(
        resultado.error ||
          resultado.message ||
          "Error al eliminar el registro.",
      );
    }
  },
};
