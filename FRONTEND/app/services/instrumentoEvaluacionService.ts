import type { InstrumentoEvaluacion } from "../types/instrumentoEvaluacion";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchInstrumentos(): Promise<InstrumentoEvaluacion[]> {
  const res = await fetch(`${API_URL}/api/instrumentos-evaluacion`);
  if (!res.ok) throw new Error("Error al obtener los instrumentos");
  return res.json();
}

export async function crearInstrumento(data: {
  titulo: string;
  descripcion: string;
  nombreArchivo: string;
  archivoBase64: string;
}): Promise<InstrumentoEvaluacion> {
  const res = await fetch(`${API_URL}/api/instrumentos-evaluacion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al subir el instrumento");
  return res.json();
}

export async function eliminarInstrumento(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/instrumentos-evaluacion/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar el instrumento");
}
