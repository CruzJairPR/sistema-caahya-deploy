import { EntidadDirectorio } from "../types/entidad";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/directorios`
  : "http://localhost:5000//api/v1/directorios";

export const entidadService = {
  async getAll(): Promise<EntidadDirectorio[]> {
    const res = await fetch(API_URL, { method: "GET" });
    if (!res.ok) throw new Error("Error al obtener el directorio de entidades");
    return res.json();
  },

  async create(
    data: Omit<EntidadDirectorio, "_id">,
  ): Promise<EntidadDirectorio> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear la entidad");
    return res.json();
  },

  async update(
    id: string,
    data: Partial<EntidadDirectorio>,
  ): Promise<EntidadDirectorio> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar la entidad");
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar la entidad");
  },
};

export default entidadService;
