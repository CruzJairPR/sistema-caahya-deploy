export interface ArquitecturaRaw {
  _id?: string;
  CARRERA?: string;
  carrera?: string;
  FACU?: string;
  facu?: string;
  PERSONA?: string;
  persona?: string;
  "CORREO ELECTRÓNICO"?: string;
  correo?: string;
  [key: string]: unknown;
}

export interface MiembroArquitectura {
  _id?: string;
  carrera: string;
  facultad: string;
  persona: string;
  nombramiento: string;
  correo: string;
  [key: string]: unknown;
}

export interface NotificacionArquitectura {
  mensaje: string;
  tipo: "success" | "error" | "info";
}
