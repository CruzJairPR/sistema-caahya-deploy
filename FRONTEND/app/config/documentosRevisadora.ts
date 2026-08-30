export const documentosRevisadora = {
  sesion: {
    tipo: "sesion",
    nombreSingular: "sesión",
    nombreSingularCapitalizado: "Sesión",
    nombrePlural: "sesiones",
  },
  acta: {
    tipo: "acta",
    nombreSingular: "acta",
    nombreSingularCapitalizado: "Acta",
    nombrePlural: "actas",
  },
  recursos_primer_periodo: {
    tipo: "recursos_primer_periodo",
    nombreSingular: "recurso",
    nombreSingularCapitalizado: "Recurso",
    nombrePlural: "recursos",
  },
  recursos_segundo_periodo: {
    tipo: "recursos_segundo_periodo",
    nombreSingular: "recurso",
    nombreSingularCapitalizado: "Recurso",
    nombrePlural: "recursos",
  },
} as const;

export type DocumentoRevisadoraKey = keyof typeof documentosRevisadora;
