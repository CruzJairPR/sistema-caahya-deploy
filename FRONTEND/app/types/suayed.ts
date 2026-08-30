export interface PlanEstudioSuayed {
  _id?: string;
  licenciatura: string;
  entidad: string;
  creacion_implantacion: number | string | null;
  modificacion: number | string | null;
  evaluacion: number | string | null;
  adecuacion_temas_emergentes: string | null;
  adecuacion_titulacion: string | null;
  [key: string]: unknown;
}

export interface NotificacionSuayed {
  mensaje: string;
  tipo: "success" | "error" | "info";
}
