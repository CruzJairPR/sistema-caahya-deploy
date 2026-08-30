import { logger } from "../lib/logger";
import { PlanEstudio } from "../types/planes";
import { apiFetch } from "../utils/apiFetch";

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

function getEndpoint(): string {
  return `${getBaseUrl()}/api/v1/planEstudios`;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const planesService = {
  getAll: async (): Promise<PlanEstudio[]> => {
    const url = getEndpoint();

    logger.log(
      `%c API PLANES DE ESTUDIO: %c${url}`,
      "color: #ee9105; font-weight: bold; font-size: 12px;",
      "color: #00b0ff; font-style: italic;",
    );

    const res = await apiFetch("/api/v1/planEstudios?limit=500");
    const resultado = await handleResponse<
      { success?: boolean; data?: PlanEstudio[] } | PlanEstudio[]
    >(res);

    const lista: PlanEstudio[] = Array.isArray(resultado)
      ? resultado
      : ((resultado as { data?: PlanEstudio[] }).data ?? []);

    return lista;
  },

  create: async (newRow: Record<string, string | number>): Promise<void> => {
    const res = await apiFetch("/api/v1/planEstudios", {
      method: "POST",
      body: JSON.stringify(newRow),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message ?? `HTTP ${res.status}`);
  },

  update: async (id: string, updatedRow: PlanEstudio): Promise<void> => {
    // 👈 4. Reemplazamos por apiFetch
    const res = await apiFetch(`/api/v1/planEstudios/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedRow),
    });
    await handleResponse(res);
  },

  remove: async (id: string): Promise<void> => {
    // 👈 5. Reemplazamos por apiFetch
    const res = await apiFetch(`/api/v1/planEstudios/${id}`, {
      method: "DELETE",
    });
    await handleResponse(res);
  },
};
