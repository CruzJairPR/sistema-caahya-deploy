// services/difusionService.ts

export interface MiembroDifusion {
  _id: string;
  "No."?: number | null;
  Nombre: string | null;
  Cargo: string | null;
  Adscripción: string | null;
  Correo: string | null;
  correo2: string | null;
  Teléfono: string | null;
  Telefono2: string | null;
  Observaciones: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  [key: string]: unknown;
}

const getApiUrl = (): string => {
  const base = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "";
  return base ? `${base}/api/v1/difusion` : "";
};

const getHeaders = (): Record<string, string> => {
  let token = "";

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";

    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const difusionService = {
  async obtenerTodos(): Promise<MiembroDifusion[]> {
    const url = getApiUrl();
    if (!url) throw new Error("La URL de la API no está configurada.");

    const respuesta = await fetch(url, { headers: getHeaders() });
    const resultado = await respuesta.json();

    if (!resultado.success)
      throw new Error(resultado.error || "Error al obtener miembros");

    const datosRaw = Array.isArray(resultado.data) ? resultado.data : [];

    return datosRaw.map((item: any) => {
      let idLimpio = "";
      if (item._id) {
        idLimpio =
          typeof item._id === "object" && item._id.$oid
            ? item._id.$oid
            : String(item._id);
      }

      return {
        _id: idLimpio,
        "No.": item["No."] ?? item.numero ?? null,
        Nombre: item.Nombre ?? item.nombre ?? "",
        Cargo: item.Cargo ?? item.cargo ?? "",
        Adscripción: item.Adscripción ?? item.adscripcion ?? "",
        Correo: item.Correo ?? item.correo ?? "",
        correo2: item.correo2 ?? "",
        Teléfono: item.Teléfono ?? item.telefono ?? "",
        Telefono2: item.Telefono2 ?? item.telefono2 ?? "",
        Observaciones: item.Observaciones ?? item.observaciones ?? "",
        fechaInicio: item.fechaInicio ? item.fechaInicio.split("T")[0] : "",
        fechaFin: item.fechaFin ? item.fechaFin.split("T")[0] : "",
      };
    });
  },

  async crear(nuevoMiembro: Record<string, any>): Promise<any> {
    const url = getApiUrl();
    if (!url) throw new Error("La URL de la API no está configurada.");

    const payload = {
      Nombre: nuevoMiembro.Nombre || nuevoMiembro.nombre || "",
      Cargo: nuevoMiembro.Cargo || nuevoMiembro.cargo || "",
      Adscripción: nuevoMiembro.Adscripción || nuevoMiembro.adscripcion || "",
      Correo: nuevoMiembro.Correo || nuevoMiembro.correo || "",
      correo2: nuevoMiembro.correo2 || "",
      Teléfono: nuevoMiembro.Teléfono || nuevoMiembro.telefono || "",
      Telefono2: nuevoMiembro.Telefono2 || nuevoMiembro.telefono2 || "",
      Observaciones:
        nuevoMiembro.Observaciones || nuevoMiembro.observaciones || "",
      fechaInicio: nuevoMiembro.fechaInicio || null,
      fechaFin: nuevoMiembro.fechaFin || null,
    };

    const respuesta = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const resultado = await respuesta.json();

    if (!resultado.success)
      throw new Error(resultado.error || "Error al crear miembro");
    return resultado.data;
  },

  async actualizar(
    id: string,
    miembroActualizado: MiembroDifusion,
  ): Promise<void> {
    const url = getApiUrl();
    if (!url) throw new Error("La URL de la API no está configurada.");

    const respuesta = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
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
      headers: getHeaders(),
    });
    const resultado = await respuesta.json();

    if (!resultado.success)
      throw new Error(resultado.error || "Error al eliminar miembro");
  },
};
