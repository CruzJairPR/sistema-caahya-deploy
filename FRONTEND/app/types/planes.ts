export interface PlanEstudio {
  _id?: string;
  sistema: string;
  licenciatura: string;
  entidad: string;
  creacion_implantacion: number | string;
  modificacion: number | string | null;
  evaluacion: number | string | null;
  adecuacion_temas_emergentes: number | string | null;
  adecuacion_titulacion: number | string | null;
  [key: string]: unknown;
}

export interface NotificacionPlanes {
  mensaje: string;
  tipo: "success" | "error" | "info";
}
