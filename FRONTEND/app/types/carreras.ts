export interface MiembroCarreraReg {
  _id?: string;
  carrera: string;
  facultad: string;
  sede: string;
  persona: string;
  nombramiento: string;
  correo: string;
  [key: string]: unknown;
}

export type NotificacionConfig = {
  mensaje: string;
  tipo: "success" | "error";
};
