import { TablaOrigen } from "../types/alertas";

export interface PestanaDgapa {
  label: TablaOrigen;
  value: string;
}

export const PESTANHAS_DGAPA: PestanaDgapa[] = [
  { label: "PAPIIT Comite Evaluador", value: "papiit_comite_evaluador" },
  { label: "PAPIIT Inv Aplicada", value: "papiit_inv_aplicada" },
  { label: "PAPIIT Proyectos de Grupo", value: "papiit_proyectos_de_grupo" },
  {
    label: "PAPIIT Infraestructura academica",
    value: "papiit_infraestructura_academica",
  },
  { label: "PAPIME", value: "papime" },
  { label: "PASPA", value: "paspa" },
  { label: "Becas Posdoctorales", value: "becas_posdoc" },
  { label: "PASD", value: "pasd" },
];
