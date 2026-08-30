const API_URL = "http://localhost:5000/api/v1/revisadoraSesiones";

export interface CrearSesionPayload {
  titulo: string;
  descripcion: string;
  nombreArchivo: string;
  archivoBase64: string;
  tipo?: string;
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

  console.log("🛠️ Headers actualizados para la petición:", headers);

  return headers;
};

export async function fetchSesionesRevisadora(tipo?: string) {
  const url = tipo ? `${API_URL}?tipo=${encodeURIComponent(tipo)}` : API_URL;
  const respuesta = await fetch(url, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await respuesta.json();

  if (!respuesta.ok || data.success === false) {
    throw new Error(
      data.error ||
        data.mensaje ||
        "No se pudo obtener el listado de sesiones.",
    );
  }

  return data.data || data;
}

export async function crearSesionRevisadora(payload: CrearSesionPayload) {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok || data.success === false) {
    throw new Error(data.error || data.mensaje || "Error al subir la sesión.");
  }

  return data.data || data;
}

export async function actualizarSesionRevisadora(
  id: string,
  payload: Partial<CrearSesionPayload>,
) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok || data.success === false) {
    throw new Error(
      data.error || data.mensaje || "Error al intentar actualizar la sesión.",
    );
  }

  return data.data || data;
}

export async function eliminarSesionRevisadora(id: string) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok || data.success === false) {
    throw new Error(
      data.error || data.mensaje || "No se pudo eliminar la sesión.",
    );
  }

  return data.data || data;
}
