export type TablaOrigen =
  | "Comisiones Dictaminadoras"
  | "Comision Evaluadora PRIDE"
  | "PAPIIT Comite Evaluador"
  | "PAPIIT Inv Aplicada"
  | "PAPIIT Proyectos de Grupo"
  | "PAPIIT Infraestructura academica"
  | "PAPIME"
  | "PASPA"
  | "Becas Posdoctorales"
  | "PASD"
  | "Plan de Estudios"
  | "SUAyED"
  | "Comisión Revisadora PRIDE"
  | "Comisión Especial PRIDE"
  | "Directorio de Entidades"
  | "Comité de Carreras"
  | "Comisión Especial de Lenguas"
  | "Comisión de Difusión y Extensión"
  | "Comité de Carreras"
  | "Comité de Carrera Arquitectura"
  | "Comité de Carrera de Diseño"
  | "Comité de Carrera de Desarrollo y Gestión Intelectual"
  | "Comité de Carrera de Filosofía"
  | "Comité de Carrera de Historia"
  | "Comité de Carrera de Pedagogía"
  | "Comisión Especial de Lenguas"
  | "Comisión Especial de Lenguas - Coordinadores";

export interface AlertaCampana {
  id: number;
  tipo: "alerta" | "aviso" | "info";
  texto: string;
  tablaOrigen?: TablaOrigen;
  accion: "miembros" | "ninguna" | string;
}
