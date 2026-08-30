import { Dictaminadora } from "../types/dictaminadora";

const base_api = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "http://localhost:5000";

const API_URL = `${base_api}/api/v1/comisiones`;

export const dictaminadoraService = {
  async getAll(): Promise<Dictaminadora[]> {
    const res = await fetch(API_URL, { method: "GET" });
    if (!res.ok)
      throw new Error("Error al obtener las comisiones dictaminadoras");
    const resultado = await res.json();

    if (resultado.success && Array.isArray(resultado.data)) {
      return resultado.data.map((item: any) => {
        const numeroNormalizado =
          item.Número !== undefined ? item.Número : item.Numero;

        return {
          ...item,
          Número: numeroNormalizado,
        };
      });
    }
    return [];
  },

  async create(data: Omit<Dictaminadora, "_id">): Promise<Dictaminadora> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resultado = await res.json();
    if (!res.ok || !resultado.success) {
      throw new Error(resultado.error || "Error al crear la comisión");
    }
    return resultado.data;
  },

  async update(
    id: string,
    data: Partial<Dictaminadora>,
  ): Promise<Dictaminadora> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resultado = await res.json();
    if (!res.ok || !resultado.success) {
      throw new Error(resultado.error || "Error al actualizar la comisión");
    }
    return resultado.data;
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
