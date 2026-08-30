export interface CatalogoBase {
  _id?: string;
  Comisión?: string;
  Miembro?: string;
  Adscripción?: string;
  "Categoría y nivel"?: string;
  "Fuente de Designación"?: string;
  Periodo?: string;
  Inicio?: string;
  Término?: string;
  Permanencia?: string;
  Observaciones?: string;
  "Prefencias de áreas CAAHyA"?: string;
  "Última modificación a la base"?: string;
  "Miembro anterior"?: string;
  [key: string]: unknown;
}

export type ComisionDictaminadora = CatalogoBase;
export type ComisionPRIDE = CatalogoBase;
export type ComisionDGAPA = CatalogoBase;
export type suayed = CatalogoBase;
