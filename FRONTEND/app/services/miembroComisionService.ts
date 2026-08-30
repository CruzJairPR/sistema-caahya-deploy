import { MiembroComision } from "../types/miembroComision";

const base_api = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "";

const API_URL = `${base_api}/api/v1/miembros`;

export const miembrosComisionService = {
  // GET ALL
  async getAll(): Promise<MiembroComision[]> {
    if (!base_api) throw new Error("API URL no configurada.");

    const respuesta = await fetch(API_URL, { cache: "no-store" });
    const resultado = await respuesta.json();

    if (!resultado.success) {
      throw new Error(resultado.error || "Error al obtener los miembros.");
    }

    const lista = resultado.data ?? resultado;
    if (!Array.isArray(lista)) return [];

    return lista.map((item: any) => ({
      _id: item._id?.$oid ?? item._id,
      No: item.No !== undefined ? Number(item.No) : null,
      Nombre: item.Nombre ?? "",
      Adscripción: item.Adscripción ?? "",
      Correo: item.Correo ?? "",
      Teléfono: item.Teléfono ?? "",
      Rol: item.Rol ?? "",
      Entidad: item.Entidad ?? "",
      Periodo: item.Periodo ?? "",
    }));
  },

  // CREATE
  async create(newRow: Record<string, string>): Promise<void> {
    if (!base_api) throw new Error("API URL no configurada.");

    // Forzamos el parseo numérico del campo "No" antes de enviarlo
    const dataToSend = {
      ...newRow,
      No: newRow.No ? Number(newRow.No) : null,
    };

    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const resultado = await respuesta.json();
    if (!resultado.success) {
      throw new Error(resultado.error || "Error al registrar miembro.");
    }
  },

  // UPDATE
  async update(updatedRow: MiembroComision): Promise<void> {
    if (!base_api) throw new Error("API URL no configurada.");

    const respuesta = await fetch(`${API_URL}/${updatedRow._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRow),
    });

    const resultado = await respuesta.json();
    if (!resultado.success) {
      throw new Error(resultado.error || "Error al actualizar miembro.");
    }
  },

  // DELETE
  async delete(id: string): Promise<void> {
    if (!base_api) throw new Error("API URL no configurada.");

    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const resultado = await respuesta.json();
    if (!resultado.success) {
      throw new Error(resultado.error || "Error al eliminar miembro.");
    }
  },
};
