export interface ComisionPermanenteReg {
  _id?: string;
  Número: number;
  Entidad: string;
  Comisión: string;
  "Fuente de Designación": string;
  Miembro: string;
  Adscripción: string;
  "Categoría y nivel"?: string | null;
  Periodo: string;
  Inicio: string;
  Término: string;
  Permanencia?: string | null;
  Observaciones?: string | null;
  "Miembro anterior"?: string | null;
  [key: string]: unknown;
}

export type NotificacionConfig = {
  mensaje: string;
  tipo: "success" | "error";
};
