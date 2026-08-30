export type EntidadDirectorio = {
  _id?: string;
  entidad: string;
  directorNombre: string;
  directorCorreo: string;
  directorTelefono?: string;
  secretarioNombre: string;
  secretarioCorreo: string;
  secretarioTelefono?: string;
  [key: string]: unknown;
};

export interface NotificacionEntidad {
  tipo: "success" | "error" | "info" | "warning";
  mensaje: string;
}
