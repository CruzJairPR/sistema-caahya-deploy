import { apiFetch } from "../utils/apiFetch";

const ENDPOINT = "/actas";

export interface CrearActaPayload {
  titulo: string;
  descripcion: string;
  nombreArchivo: string;
  archivoBase64: string;
  tipo?: string;
}

export async function fetchActas(tipo?: string) {
  const url = tipo ? `${ENDPOINT}?tipo=${tipo}` : ENDPOINT;
  const respuesta = await apiFetch(url);

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el listado de actas del servidor.");
  }
  return await respuesta.json();
}

export async function crearActa(payload: CrearActaPayload) {
  const respuesta = await apiFetch(ENDPOINT, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!respuesta.ok) {
    const errorData = await respuesta.json().catch(() => ({}));
    throw new Error(
      errorData.mensaje || "Error al intentar subir el acta al servidor.",
    );
  }
  return await respuesta.json();
}

export async function actualizarActa(
  id: string,
  payload: Partial<CrearActaPayload>,
) {
  const respuesta = await apiFetch(`${ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!respuesta.ok) {
    const errorData = await respuesta.json().catch(() => ({}));
    throw new Error(
      errorData.mensaje || "Error al intentar actualizar el acta.",
    );
  }
  return await respuesta.json();
}

export async function eliminarActa(id: string) {
  const respuesta = await apiFetch(`${ENDPOINT}/${id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    const errorData = await respuesta.json().catch(() => ({}));
    throw new Error(
      errorData.mensaje || "No se pudo eliminar el acta del servidor.",
    );
  }
  return await respuesta.json();
}
