// app/services/commissionArtesService.ts
import { MiembroComisionArtes } from "../types/comisionArtes";

const base_api = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "";

const API_URL = `${base_api}/api/v1/miembroComisionArtes`;

export const comisionArtesService = {
  // GET ALL
  async getAll(): Promise<MiembroComisionArtes[]> {
    if (!base_api) throw new Error("API URL no configurada.");

    const respuesta = await fetch(API_URL, { cache: "no-store" });
    const resultado = await respuesta.json();

    if (!resultado.success) {
      throw new Error(
        resultado.error || "Error al obtener los miembros de artes.",
      );
    }

    const lista = resultado.data ?? resultado;
    if (!Array.isArray(lista)) return [];

    return lista.map((item: any) => ({
      _id: item._id?.$oid ?? item._id,
      rol: item.rol ?? "",
      nombre: item.nombre ?? "",
      correo: item.correo ?? "",
    }));
  },

  // CREATE
  async create(newRow: Record<string, string>): Promise<void> {
    if (!base_api) throw new Error("API URL no configurada.");

    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRow),
    });

    const resultado = await respuesta.json();
    if (!resultado.success) {
      throw new Error(resultado.error || "Error al registrar el integrante.");
    }
  },

  // UPDATE
  async update(updatedRow: MiembroComisionArtes): Promise<void> {
    if (!base_api) throw new Error("API URL no configurada.");

    const respuesta = await fetch(`${API_URL}/${updatedRow._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRow),
    });

    const resultado = await respuesta.json();
    if (!resultado.success) {
      throw new Error(resultado.error || "Error al actualizar el integrante.");
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
      throw new Error(resultado.error || "Error al eliminar el integrante.");
    }
  },
};
