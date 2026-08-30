export interface MediaDocumento {
  _id: string;
  titulo: string;
  descripcion: string;
  nombreArchivo: string;
  archivoBase64: string;
  tipoFormato: string;
  fechaSubida: string;
}

export interface NotificacionMediaState {
  tipo: "success" | "error" | "warning" | "info";
  mensaje: string;
}
