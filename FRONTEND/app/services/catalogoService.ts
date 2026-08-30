import { CatalogoBase } from "../types/catalogo";
import { catalogos, CatalogoKey } from "../config/catalogos"; 

export function crearCatalogoService<T extends CatalogoBase>(key: CatalogoKey) {
  const baseUrl = catalogos[key].endpoint;

  return {
    obtenerTodas: async (): Promise<T[]> => {
      const res = await fetch(baseUrl);
      if (!res.ok) throw new Error("Error al obtener datos");
      const json = await res.json();
      return json.data; 
    },
    crear: async (data: Omit<T, "_id">): Promise<T> => {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al crear");
      return res.json();
    },
    actualizar: async (id: string, data: Partial<T>): Promise<T> => {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      return res.json();
    },
    eliminar: async (id: string): Promise<void> => {
      const res = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
    },
  };
}
