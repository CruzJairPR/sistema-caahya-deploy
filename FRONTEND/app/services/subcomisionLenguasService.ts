import { SubcomisionMiembro } from "../types/subcomisionLenguas";

const base_api = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "";

const API_URL = `${base_api}/api/v1/coel-miembros`;

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

export const subcomisionLenguasService = {
  // GET ALL
  async getAll(): Promise<SubcomisionMiembro[]> {
    if (!base_api) throw new Error("API URL no configurada.");

    const respuesta = await fetch(API_URL, {
      cache: "no-store",
      headers: getHeaders(),
    });
    if (!respuesta.ok)
      throw new Error("Error al obtener los miembros del servidor.");

    const resultado = await respuesta.json();
    const lista = resultado.data ?? resultado;

    if (!Array.isArray(lista)) return [];

    return lista.map((item: any) => ({
      _id: item._id?.$oid ?? item._id,
      idioma: item.idioma ?? "",
      integrante: item.integrante ?? null,
      cargo: item.cargo ?? null,
      adscripcion: item.adscripcion ?? null,
      periodo_integrante: {
        periodo: item.periodo_integrante?.periodo ?? null,
        fecha_inicio: item.periodo_integrante?.fecha_inicio ?? null,
        fecha_final: item.periodo_integrante?.fecha_final ?? null,
      },
      coordinacion: {
        es_coordinador: item.coordinacion?.es_coordinador ?? false,
        periodo: item.coordinacion?.periodo ?? null,
        fecha_inicio: item.coordinacion?.fecha_inicio ?? null,
        fecha_final: item.coordinacion?.fecha_final ?? null,
      },
    }));
  },

  // CREATE
  async create(newRow: Record<string, any>): Promise<void> {
    if (!base_api) throw new Error("API URL no configurada.");

    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(newRow),
    });

    if (!respuesta.ok) {
      const resultado = await respuesta.json();
      throw new Error(resultado.message || "Error al crear el registro.");
    }
  },

  // UPDATE
  async update(updatedRow: SubcomisionMiembro): Promise<void> {
    if (!base_api) throw new Error("API URL no configurada.");

    // Extracción segura del ID en caso de que venga envuelto en un objeto
    let idLimpio = updatedRow._id as any;
    if (typeof idLimpio === "object" && idLimpio !== null) {
      idLimpio = idLimpio.$oid || idLimpio.toString();
    }

    if (!idLimpio) {
      throw new Error("El ID del registro no es válido para actualizar.");
    }

    const urlFinal = `${API_URL}/${idLimpio}`;
    console.log("➡️ URL PUT ejecutada:", urlFinal);

    const respuesta = await fetch(urlFinal, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updatedRow),
    });

    if (!respuesta.ok) {
      const resultado = await respuesta.json();
      throw new Error(resultado.message || "Error al actualizar el registro.");
    }
  },

  // DELETE
  async delete(id: string | any): Promise<void> {
    if (!base_api) throw new Error("API URL no configurada.");

    let idLimpio = id;
    if (typeof idLimpio === "object" && idLimpio !== null) {
      idLimpio = idLimpio.$oid || idLimpio.toString();
    }

    const urlFinal = `${API_URL}/${idLimpio}`;
    console.log("➡️ URL DELETE ejecutada:", urlFinal);

    const respuesta = await fetch(urlFinal, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!respuesta.ok) {
      const resultado = await respuesta.json();
      throw new Error(resultado.message || "Error al eliminar el registro.");
    }
  },
};
