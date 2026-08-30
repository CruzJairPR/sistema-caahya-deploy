import { MiembroCarreraReg } from "../types/carreras";

const base_api = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "";

const getApiUrl = (apiPath: string) => `${base_api}/api/v1/${apiPath}`;

// Función auxiliar para obtener las cabeceras con el token de autenticación
const getHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const comisionCarrerasService = {
  // GET ALL
  async getAll(apiPath: string): Promise<MiembroCarreraReg[]> {
    if (!base_api) throw new Error("API URL no configurada.");

    const respuesta = await fetch(getApiUrl(apiPath), {
      cache: "no-store",
      headers: getHeaders(),
    });
    const resultado = await respuesta.json();

    // Soportamos tanto si viene envuelto en { success, data } como si es un arreglo directo
    const rawData =
      resultado.success !== undefined ? resultado.data : resultado;

    if (!Array.isArray(rawData)) {
      throw new Error(
        resultado.error ||
          resultado.mensaje ||
          "Error al obtener registros del servidor.",
      );
    }

    return rawData.map((item: any) => {
      const llaveNombramiento = Object.keys(item).find((k) =>
        k.toUpperCase().includes("NOMBRAMIENTO"),
      );
      const valorNombramiento = llaveNombramiento
        ? item[llaveNombramiento]
        : item["nombramiento"] || "";

      return {
        _id: item._id?.$oid ?? item._id,
        carreraId: item["carreraId"] || "",
        persona: item["persona"] || item["PERSONA"] || "",
        nombramiento: valorNombramiento,
        carrera: item["carrera"] || item["CARRERA"] || "",
        facultad: item["facu"] || item["FACU"] || item["entidad"] || "",
        sede: item["sede"] || item["SEDE"] || item["entidad"] || "",
        correo:
          item["correo"] ||
          item["CORREO ELECTRÓNICO"] ||
          "Sin correo especificado",
        fechaInicio: item["fechaInicio"] || "",
        fechaTermino: item["fechaTermino"] || "",
      };
    });
  },

  // CREATE
  async create(apiPath: string, newRow: Record<string, string>): Promise<void> {
    if (!base_api) throw new Error("API URL no configurada.");

    const respuesta = await fetch(getApiUrl(apiPath), {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(newRow),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok || resultado.success === false) {
      throw new Error(
        resultado.error || resultado.mensaje || "Error al crear.",
      );
    }
  },

  // UPDATE
  async update(apiPath: string, updatedRow: MiembroCarreraReg): Promise<void> {
    if (!base_api) throw new Error("API URL no configurada.");

    const respuesta = await fetch(`${getApiUrl(apiPath)}/${updatedRow._id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updatedRow),
    });

    const resultado = await respuesta.json();
    if (!respuesta.ok || resultado.success === false) {
      throw new Error(
        resultado.error || resultado.mensaje || "Error al actualizar.",
      );
    }
  },

  // DELETE
  async delete(apiPath: string, id: string): Promise<void> {
    if (!base_api) throw new Error("API URL no configurada.");

    const respuesta = await fetch(`${getApiUrl(apiPath)}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    const resultado = await respuesta.json();
    if (!respuesta.ok || resultado.success === false) {
      throw new Error(
        resultado.error || resultado.mensaje || "Error al eliminar.",
      );
    }
  },
};
