export interface Dictaminadora {
  _id?: string;
  colorUrgencia?: "red" | "yellow" | "default";
  Número: number;
  Entidad: string;
  Comisión: string;
  "Fuente de Designación"?: string | null;
  Miembro: string;
  Adscripción: string;
  "Categoría y nivel": string | null;
  Periodo: string;
  Inicio: string;
  Término: string;
  Permanencia?: string | null;
  Observaciones?: string | null;
  "Prefencias de áreas CAAHyA"?: string | null;
  "Última modificación a la base"?: string | null;
  "Miembro anterior"?: string | null;
  [key: string]: unknown;
}

export interface NotificacionDictaminadora {
  tipo: "success" | "error" | "info" | "warning";
  mensaje: string;
}
