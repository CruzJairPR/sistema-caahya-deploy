import { logger } from "../lib/logger";
import { MiembroArquitectura, ArquitecturaRaw } from "../types/arquitectura";
import { mapToArquitectura, mapToRaw } from "../utils/arquitecturaMapper";

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

function getEndpoint(): string {
  return `${getBaseUrl()}/api/v1/arquitectura`;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const arquitecturaService = {
  getAll: async (): Promise<MiembroArquitectura[]> => {
    const url = getEndpoint();
    logger.log(
      `%c🏛️ API COMISIÓN ARQUITECTURA: %c${url}`,
      "color: #ee9105; font-weight: bold; font-size: 12px;",
      "color: #00b0ff; font-style: italic;",
    );

    const res = await fetch(`${url}?limit=500`);
    const resultado = await handleResponse<{
      success?: boolean;
      data?: ArquitecturaRaw[];
    }>(res);

    const lista = resultado.data ?? [];
    return lista.map(mapToArquitectura);
  },

  create: async (newRow: Record<string, string>): Promise<void> => {
    const res = await fetch(getEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapToRaw(newRow)),
    });

    const json = await res.json();
    if (!res.ok || !json.success)
      throw new Error(json?.error || json?.message || `HTTP ${res.status}`);
  },

  update: async (
    id: string,
    updatedRow: MiembroArquitectura,
  ): Promise<void> => {
    const res = await fetch(`${getEndpoint()}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapToRaw(updatedRow)),
    });
    await handleResponse(res);
  },

  remove: async (id: string): Promise<void> => {
    const res = await fetch(`${getEndpoint()}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    await handleResponse(res);
  },
};
