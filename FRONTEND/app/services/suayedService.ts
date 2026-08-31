import { logger } from "../lib/logger";
import { PlanEstudioSuayed } from "../types/suayed";
function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

function getEndpoint(): string {
  return `${getBaseUrl()}/api/v1/planEstudioSuayed`;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const suayedService = {
  getAll: async (): Promise<PlanEstudioSuayed[]> => {
    const url = getEndpoint();

    const res = await fetch(`${url}?limit=500`);
    const resultado = await handleResponse<
      { success?: boolean; data?: PlanEstudioSuayed[] } | PlanEstudioSuayed[]
    >(res);

    const lista: PlanEstudioSuayed[] = Array.isArray(resultado)
      ? resultado
      : ((resultado as { data?: PlanEstudioSuayed[] }).data ?? []);

    return lista;
  },

  create: async (
    newRow: Record<string, string | number | null>,
  ): Promise<void> => {
    const res = await fetch(getEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRow),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message ?? `HTTP ${res.status}`);
  },

  update: async (id: string, updatedRow: PlanEstudioSuayed): Promise<void> => {
    const res = await fetch(`${getEndpoint()}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRow),
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
