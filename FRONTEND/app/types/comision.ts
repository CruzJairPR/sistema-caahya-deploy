export interface ComisionDictaminadora {
  _id?: string;
  Número: number;
  Entidad: string;
  Comisión: string;
  Miembro: string;
  Adscripción: string;
  "Categoría y nivel": string | null;
  Periodo: string;
  Inicio: string;
  Término: string;
  [key: string]: unknown;
}

export interface NotificacionComision {
  tipo: "success" | "error" | "info" | "warning";
  mensaje: string;
}
