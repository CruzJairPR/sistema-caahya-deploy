export interface MiembroComisionArtes {
  _id?: string;
  rol?: string;
  nombre?: string;
  correo?: string;
  correo2?: string;
  telefono?: string;
  telefono2?: string;
  comentarios?: string;
  [key: string]: unknown;
}

export type NotificacionConfig = {
  mensaje: string;
  tipo: "success" | "error";
};
