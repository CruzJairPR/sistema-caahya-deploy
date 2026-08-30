const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const catalogos = {
  dictaminadoras: {
    endpoint: `${API_BASE}/api/v1/comisiones`,
    nombre: "Comisiones Dictaminadoras",
  },
  pride: {
    endpoint: `${API_BASE}/api/v1/pride`,
    nombre: "Comisiones PRIDE",
  },
  dgapa: {
    endpoint: `${API_BASE}/api/v1/dgapa`,
    nombre: "Comisiones DGAPA",
  },
  suayed: {
    endpoint: `${API_BASE}/api/v1/suayed`,
    nombre: "Planes de Estudio SUAyED",
  },
} as const;

export type CatalogoKey = keyof typeof catalogos;
