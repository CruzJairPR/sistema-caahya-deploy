// Función para obtener la URL base de forma dinámica según el navegador del usuario
const getApiBase = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    return `http://${hostname}:5000/api/v1`;
  }
  return "http://localhost:5000/api/v1";
};

const API_BASE = getApiBase();
const API_URL = `${API_BASE}/media`;

interface CrearMediaPayload {
  titulo: string;
  descripcion: string;
  nombreArchivo: string;
  archivoBase64: string;
  tipoFormato?: string;
}

/**
 * Obtiene todos los archivos multimedia registrados en el backend
 */
export async function fetchMedia() {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) {
      throw new Error(
        "No se pudo obtener el listado de archivos del servidor.",
      );
    }
    return await respuesta.json();
  } catch (error: any) {
    throw new Error(
      error.message || "Error de red al intentar conectar con el servidor.",
    );
  }
}

/**
 * Envía un archivo codificado en Base64 junto con sus metadatos al backend
 */
export async function crearMedia(payload: CrearMediaPayload) {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!respuesta.ok) {
    const errorData = await respuesta.json().catch(() => ({}));
    throw new Error(
      errorData.mensaje || "Error al intentar subir el archivo al servidor.",
    );
  }

  return await respuesta.json();
}

/**
 * Actualiza un archivo multimedia existente por su ID
 */
export async function actualizarMedia(
  id: string,
  payload: Partial<CrearMediaPayload>,
) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!respuesta.ok) {
    const errorData = await respuesta.json().catch(() => ({}));
    throw new Error(
      errorData.mensaje || "Error al intentar actualizar el archivo.",
    );
  }

  return await respuesta.json();
}

/**
 * Elimina un archivo multimedia del servidor mediante su ID único de MongoDB
 */
export async function eliminarMedia(id: string) {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json().catch(() => ({}));
      throw new Error(
        errorData.mensaje || "No se pudo eliminar el archivo del servidor.",
      );
    }

    return await respuesta.json();
  } catch (error: any) {
    throw new Error(
      error.message || "Error de red al intentar eliminar el archivo.",
    );
  }
}
