// services/revisadoraService.ts

const API_BASE = "http://localhost:5000/api/v1";

const getHeaders = () => {
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }
  }
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Recibimos el nombre del recurso por parámetro ("revisadoraSesiones" o "revisadoraActas")
export async function fetchRecursos(endpoint: string) {
  const respuesta = await fetch(`${API_BASE}/${endpoint}`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await respuesta.json();
  if (!respuesta.ok || data.success === false) {
    throw new Error(
      data.error || data.mensaje || "Error al obtener los registros.",
    );
  }
  return data.data || data;
}

export async function crearRecurso(endpoint: string, payload: any) {
  const respuesta = await fetch(`${API_BASE}/${endpoint}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok || data.success === false) {
    throw new Error(
      data.error || data.mensaje || "Error al crear el registro.",
    );
  }
  return data.data || data;
}

export async function eliminarRecurso(endpoint: string, id: string) {
  const respuesta = await fetch(`${API_BASE}/${endpoint}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const data = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok || data.success === false) {
    throw new Error(
      data.error || data.mensaje || "Error al eliminar el registro.",
    );
  }
  return data.data || data;
}
