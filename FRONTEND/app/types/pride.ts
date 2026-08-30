export interface PrideRaw {
  _id?: { $oid?: string } | string;

  Número?: number;

  Entidad?: string;

  "Fuente de Designación"?: string;

  "Tipo de Miembro"?: string;

  Miembro?: string;

  Adscripción?: string;

  "Categoría y nivel"?: string;

  Periodo?: string;

  Inicio?: string;

  Término?: string;

  Permanencia?: string;

  Observaciones?: string;

  "Preferencias de áreas CAAHyA"?: string;

  "Última modificación a la base"?: string;

  "Miembro anterior"?: string;

  numero?: number;

  entidad?: string;

  fuenteDeDesignacion?: string;

  tipoDeMiembro?: string;

  miembro?: string;

  adscripcion?: string;

  categoriaYNivel?: string;

  periodo?: string;

  inicio?: string;

  termino?: string;

  permanencia?: string;

  observaciones?: string;

  preferenciasDeAreasCAAHyA?: string;

  ultimaModificacion?: string;

  miembroAnterior?: string;
}

export interface ComisionPride {
  _id?: string;

  numero?: number;

  entidad: string;

  fuenteDeDesignacion: string;

  tipoDeMiembro: string;

  miembro: string;

  adscripcion: string;

  categoriaYNivel: string;

  periodo: string;

  inicio: string;

  termino: string;

  permanencia: string;

  observaciones: string;

  preferenciasDeAreasCAAHyA: string;

  ultimaModificacion: string;

  miembroAnterior: string;

  [key: string]: unknown;
}
