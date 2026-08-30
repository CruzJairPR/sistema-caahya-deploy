import { logger } from "../lib/logger";
import { ComisionPride, PrideRaw } from "../types/pride";
import { mapToPride, mapToRaw } from "../utils/prideMapper";

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

function getEndpoint(): string {
  return `${getBaseUrl()}/api/v1/pride`;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const prideService = {
  getAll: async (): Promise<ComisionPride[]> => {
    const url = getEndpoint();
    logger.log(
      `%c🏛️ API COMISIÓN PRIDE: %c${url}`,
      "color: #ee9105; font-weight: bold; font-size: 12px;",
      "color: #00b0ff; font-style: italic;",
    );

    const res = await fetch(`${url}?limit=500`);
    const resultado = await handleResponse<{ data?: PrideRaw[] } | PrideRaw[]>(
      res,
    );

    const lista: PrideRaw[] = Array.isArray(resultado)
      ? resultado
      : ((resultado as { data?: PrideRaw[] }).data ?? []);

    return lista.map(mapToPride);
  },

  create: async (newRow: Record<string, string>): Promise<void> => {
    console.log("📤 newRow recibido:", newRow); 
    console.log("📤 mapToRaw result:", mapToRaw(newRow)); 

    const res = await fetch(getEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapToRaw(newRow)),
    });

    const json = await res.json();
    console.log("📥 Respuesta del servidor:", json); 

    if (!res.ok) throw new Error(json?.message ?? `HTTP ${res.status}`);
  },

  update: async (id: string, updatedRow: ComisionPride): Promise<void> => {
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
