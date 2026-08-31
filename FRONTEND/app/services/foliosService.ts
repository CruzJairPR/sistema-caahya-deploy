// Función para obtener la URL base de forma dinámica según el navegador del usuario
const getApiBase = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    return `http://${hostname}:5000/api/v1`;
  }
  return "http://localhost:5000/api/v1";
};

const API_BASE = getApiBase();
const API_URL = `${API_BASE}/folios`;

interface CrearFolioPayload {
  titulo: string;
  descripcion: string;
  nombreArchivo: string;
  archivoBase64: string;
  tipoFormato?: string;
}

const getHeaders = () => {
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

/**
 * Obtiene todos los folios registrados en el backend
 */
export async function fetchFolios() {
  const respuesta = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok || data.success === false) {
    throw new Error(
      data.error || data.mensaje || "No se pudo obtener el listado de folios.",
    );
  }

  return data.data || data;
}

/**
 * Envía un folio codificado en Base64 junto con sus metadatos al backend
 */
export async function crearFolio(payload: CrearFolioPayload) {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok || data.success === false) {
    throw new Error(
      data.error ||
        data.mensaje ||
        "Error al intentar subir el folio al servidor.",
    );
  }

  return data.data || data;
}

export async function actualizarFolio(
  id: string,
  payload: Partial<CrearFolioPayload>,
) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok || data.success === false) {
    throw new Error(
      data.error || data.mensaje || "Error al actualizar el folio.",
    );
  }

  return data.data || data;
}

/**
 * Elimina un folio del servidor mediante su ID único de MongoDB
 */
export async function eliminarFolio(id: string) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok || data.success === false) {
    throw new Error(
      data.error ||
        data.mensaje ||
        "No se pudo eliminar el folio del servidor.",
    );
  }

  return data.data || data;
}
