export interface InstrumentoEvaluacion {
  _id: string;
  titulo: string;
  descripcion: string;
  nombreArchivo: string;
  archivoBase64: string;
  fechaSubida: string;
}

export interface NotificacionState {
  tipo: "success" | "error" | "info" | "warning";
  mensaje: string;
}
