export interface SubcomisionMiembro {
  _id?: string;
  idioma: string;
  integrante?: string | null;
  cargo?: string | null;
  adscripcion?: string | null;

  // Estructura anidada real que viene de MongoDB
  periodo_integrante?: {
    periodo?: string | null;
    fecha_inicio?: string | Date | null;
    fecha_final?: string | Date | null;
  };

  coordinacion?: {
    es_coordinador?: boolean;
    periodo?: string | null;
    fecha_inicio?: string | Date | null;
    fecha_final?: string | Date | null;
  };

  // Index signature para permitir flexibilidad en props dinámicas de la tabla
  [key: string]: unknown;
}

export interface NotificacionConfig {
  mensaje: string;
  tipo: "success" | "error" | "info" | "warning";
}
