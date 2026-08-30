import { ComisionDictaminadora } from "../types/comision";

const base_api = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "http://localhost:5000";

const API_URL = `${base_api}/api/v1/comisiones`;

export const comisionService = {
  async getAll(): Promise<ComisionDictaminadora[]> {
    const res = await fetch(API_URL, { method: "GET" });
    if (!res.ok) throw new Error("Error al obtener las comisiones");
    const resultado = await res.json();

    if (resultado.success && Array.isArray(resultado.data)) {
      // Filtramos preventivamente por si existieran registros vacíos
      return resultado.data.filter(
        (item: ComisionDictaminadora) =>
          item.Número !== null && item.Número !== undefined,
      );
    }
    return [];
  },

  async create(data: Omit<ComisionDictaminadora, "_id">): Promise<void> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resultado = await res.json();
    if (!res.ok || !resultado.success) {
      throw new Error(resultado.error || "Error al crear la comisión");
    }
  },

  async update(
    id: string,
    data: Partial<ComisionDictaminadora>,
  ): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resultado = await res.json();
    if (!res.ok || !resultado.success) {
      throw new Error(resultado.error || "Error al actualizar la comisión");
    }
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const resultado = await res.json();
    if (!res.ok || !resultado.success) {
      throw new Error(resultado.error || "Error al eliminar la comisión");
    }
  },
};
