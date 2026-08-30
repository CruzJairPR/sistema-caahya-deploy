export interface MiembroCoel {
  _id?: string;
  categoria: string | null;
  nombre_y_cargo: string | null;
  adscripcion: string | null;
  periodo: string | null;
  [key: string]: unknown;
}

const getApiUrl = (): string => {
  const base = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "";
  return base ? `${base}/api/v1/coel` : "";
};

export const coelService = {
  async obtenerTodos(): Promise<MiembroCoel[]> {
    const url = getApiUrl();
    if (!url) throw new Error("La URL de la API no está configurada.");

    const respuesta = await fetch(url);
    const resultado = await respuesta.json();

    if (!resultado.success)
      throw new Error(resultado.error || "Error al obtener miembros");
    return Array.isArray(resultado.data) ? resultado.data : [];
  },

  async crear(nuevoMiembro: Record<string, string>): Promise<void> {
    const url = getApiUrl();
    if (!url) throw new Error("La URL de la API no está configurada.");

    const respuesta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoMiembro),
    });
    const resultado = await respuesta.json();

    if (!resultado.success)
      throw new Error(resultado.error || "Error al crear miembro");
  },

  async actualizar(id: string, miembroActualizado: MiembroCoel): Promise<void> {
    const url = getApiUrl();
    if (!url) throw new Error("La URL de la API no está configurada.");

    const respuesta = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(miembroActualizado),
    });
    const resultado = await respuesta.json();

    if (!resultado.success)
      throw new Error(resultado.error || "Error al actualizar miembro");
  },

  async eliminar(id: string): Promise<void> {
    const url = getApiUrl();
    if (!url) throw new Error("La URL de la API no está configurada.");

    const respuesta = await fetch(`${url}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const resultado = await respuesta.json();

    if (!resultado.success)
      throw new Error(resultado.error || "Error al eliminar miembro");
  },
};
