export interface SesionDocumento {
  _id: string;
  titulo: string;
  descripcion: string;
  nombreArchivo: string;
  archivoBase64?: string;
  tipo?: string;
  archivoUrl?: string;
  fechaCreacion?: string;
  createdAt?: string;
}

export interface NotificacionSesionState {
  tipo: "success" | "error" | "warning" | "info";
  mensaje: string;
}
