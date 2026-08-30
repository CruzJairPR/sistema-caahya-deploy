// types/actas.ts
export interface ActaDocumento {
  _id: string;
  titulo: string;
  descripcion: string;
  nombreArchivo: string;
  archivoBase64?: string;
  tipo?: string;
  createdAt?: string;
}

export type NotificacionActaTipo = "success" | "error" | "warning" | "info";

export interface NotificacionActaState {
  tipo: NotificacionActaTipo;
  mensaje: string;
}
