export interface MiembroComision {
  _id?: string;
  No?: number | null;
  Adscripción?: string | null;
  Nombre?: string | null;
  Correo?: string | null;
  Teléfono?: string | null;
  Rol?: string | null;
  Entidad?: string | null;
  Periodo?: string | null;
  [key: string]: unknown;
}

export type NotificacionConfig = {
  mensaje: string;
  tipo: "success" | "error";
};
