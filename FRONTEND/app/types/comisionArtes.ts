export interface MiembroComisionArtes {
  _id?: string;
  rol: string;
  nombre: string;
  correo: string;
  [key: string]: unknown;
}

export type NotificacionConfig = {
  mensaje: string;
  tipo: "success" | "error";
};
