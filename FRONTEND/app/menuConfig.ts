export interface NavItem {
  label: string;
  path?: string;
  submenu?: NavItem[];
  note?: string;
}

const IDIOMAS = [
  "Alemán",
  "Inglés",
  "Francés",
  "Japonés",
  "Chino",
  "Italiano",
  "Portugués",
  "Purépecha",
];

const generarSubmenuIdiomasSimple = (basePath: string) => {
  return IDIOMAS.map((idioma) => {
    // Normalizamos el string: pasamos a minúsculas, quitamos acentos y cambiamos espacios por guiones
    const idiomaSlug = idioma
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

    return {
      label: idioma,
      path: `${basePath}/${idiomaSlug}`,
    };
  });
};

const SUBMENU_COMISION_ESPECIAL_PRIDE: NavItem[] = [
  { label: "Miembros", path: "/secretaria-consejo/comisionEspecialPride" },

  {
    label: "Actas",
    path: "/secretaria-consejo/comisionEspecialPride/actas",
  },
  {
    label: "Recursos de Revisión Primer Periodo",
    path: "/secretaria-consejo/comisionEspecialPride/recursos-revision-primer-periodo",
  },
  {
    label: "Recursos de Revisión Segundo Periodo",
    path: "/secretaria-consejo/comisionEspecialPride/recursos-revision-segundo-periodo",
  },
];

const SUBMENU_COMISION_REVISORA_PRIDE: NavItem[] = [
  { label: "Miembros", path: "/secretaria-consejo/comisionRevisadoraPride" },

  {
    label: "Actas",
    path: "/secretaria-consejo/comisionRevisadoraPride/actas",
  },
  {
    label: "Recursos de Revisión Primer Periodo",
    path: "/secretaria-consejo/comisionRevisadoraPride/recursos-revision-primer-periodo",
  },
  {
    label: "Recursos de Revisión Segundo Periodo",
    path: "/secretaria-consejo/comisionRevisadoraPride/recursos-revision-segundo-periodo",
  },
];

const SUBMENU_PLAN_ESTUDIOS: NavItem[] = [
  { label: "Escolarizado", path: "/secretaria-consejo/planesEstudios" },
  { label: "SUAyED", path: "/secretaria-consejo/planEstudiosSuayed" },
];

const BASE_SECRETARIA_CONSEJO: NavItem[] = [
  {
    label: "Plan de Estudios",
    submenu: SUBMENU_PLAN_ESTUDIOS,
  },
  {
    label: "Directorio de Miembros",
    path: "/secretaria-consejo/comisionesCAAHYA",
  },
  {
    label: "Comisión Especial PRIDE",
    submenu: SUBMENU_COMISION_ESPECIAL_PRIDE,
  },
  {
    label: "Comisión Revisora PRIDE",
    submenu: SUBMENU_COMISION_REVISORA_PRIDE,
  },
];

const BASE_SECRETARIA_AUXILIAR_1: NavItem[] = [
  {
    label: "Comisiones Dictaminadoras",
    path: "/secretaria-aux1/comisionesDictaminadora",
  },
  {
    label: "Directorio de Entidades",
    path: "/secretaria-aux1/DirectorioEntidades",
  },
  {
    label: "Comisiones Evaluadoras PRIDE",
    path: "/secretaria-aux1/evaluadorasPride",
  },
  {
    label: "Comisiones DGAPA",
    path: "/secretaria-aux1/comisionesDGAPA",
  },
];

const BASE_SECRETARIA_AUXILIAR_2: NavItem[] = [
  {
    label: "Comisión Especial de Lenguas",
    submenu: [
      {
        label: "Miembros de la Comisión",
        path: "/secretaria-aux2/comisionEspecialLenguas",
      },
      {
        label: "Instrumentos de Evaluación",
        submenu: generarSubmenuIdiomasSimple(
          "/secretaria-aux2/comisionEspecialLenguas/instrumentos-evaluacion",
        ),
      },
      {
        label: "Revisión de Instrumentos",
        submenu: generarSubmenuIdiomasSimple(
          "/secretaria-aux2/comisionEspecialLenguas/revision-instrumentos",
        ),
      },
      {
        label: "Materiales Didácticos",

        path: "/secretaria-aux2/comisionEspecialLenguas/materiales-didacticos",
      },

      {
        label: "Convocatorias",
        path: "/secretaria-aux2/comisionEspecialLenguas/convocatorias",
      },
      {
        label: "Sesiones",
        submenu: [
          {
            label: "De la Comisión",
            path: "/secretaria-aux2/comisionEspecialLenguas/sesiones",
          },
          {
            label: "De las Subcomisiones",
            path: "/secretaria-aux2/comisionEspecialLenguas/subcomision",
          },
        ],
      },
      {
        label: "Plan de Trabajo y avances",
        path: "/secretaria-aux2/comisionEspecialLenguas/planTrabajo",
      },
    ],
  },
  {
    label: "Comisión Permanente de Difusión y Extensión",
    submenu: [
      { label: "Miembros", path: "/secretaria-aux2/comisionDifusionExtension" },
      {
        label: "Sesiones",
        path: "/secretaria-aux2/comisionDifusionExtension/sesiones",
      },

      {
        label: "Plan de Trabajo y avances",
        path: "/secretaria-aux2/comisionDifusionExtension/planTrabajo",
      },
    ],
  },
  {
    label: "Comisión Especial de Artes",
    submenu: [
      { label: "Miembros", path: "/secretaria-aux2/miembrosComisionArtes" },
      {
        label: "Sesiones",
        path: "/secretaria-aux2/miembrosComisionArtes/sesiones",
      },
      {
        label: "Plan de Trabajo y avances",
        path: "/secretaria-aux2/miembrosComisionArtes/planTrabajo",
      },
    ],
  },
  {
    label: "Comités de Carrera",
    submenu: [
      {
        label: "Comité de Carrera Arquitectura",
        path: "/secretaria-aux2/comiteCarreras/arquitectura",
      },
      {
        label: "Comité de Carrera de Desarrollo y Gestión Intelectual",
        path: "/secretaria-aux2/comiteCarreras/desarrolloGestion",
      },
      {
        label: "Comité de Carrera de Diseño",
        path: "/secretaria-aux2/comiteCarreras/diseno",
      },
      {
        label: "Comité de Carrera de Filosofía",
        path: "/secretaria-aux2/comiteCarreras/filosofia",
      },
      {
        label: "Comité de Carrera de Historia",
        path: "/secretaria-aux2/comiteCarreras/historia",
      },
      {
        label: "Comité de Carrera de Pedagogía",
        path: "/secretaria-aux2/comiteCarreras/pedagogia",
      },
    ],
  },
];

const BASE_ASISTENTE_EJECUTIVA: NavItem[] = [
  {
    label: "Crear Oficios",
    submenu: [
      {
        label: "Control de Folios",
        path: "/asistente-ejecutiva/controlFolios",
      },
      { label: "Formatos Word", path: "/asistente-ejecutiva/formatos" },
    ],
  },
  {
    label: "Comisiones",
    submenu: [
      {
        label: "Comisiones Dictaminadoras",
        path: "/comisionesDictaminadora",
      },
      { label: "Comisiones Valuadoras", path: "/comisionesValuadoras" },
    ],
  },
];

export const MENU_PERFILES: Record<string, NavItem[]> = {
  SECRETARIA_CONSEJO: [...BASE_SECRETARIA_CONSEJO],
  SECRETARIA_AUXILIAR_1: [...BASE_SECRETARIA_AUXILIAR_1],
  SECRETARIA_AUXILIAR_2: [...BASE_SECRETARIA_AUXILIAR_2],
  COORDINADORA: [
    {
      label: "Crear Oficios",
      submenu: [
        {
          label: "Control de Folios",
          path: "/asistente-ejecutiva/controlFolios",
        },
        { label: "Formatos Word", path: "/asistente-ejecutiva/formatos" },
      ],
    },
    {
      label: "Secretaría de Consejo",
      submenu: BASE_SECRETARIA_CONSEJO,
    },
    {
      label: "Secretaría Auxiliar 1",
      submenu: BASE_SECRETARIA_AUXILIAR_1,
    },
    {
      label: "Secretaría Auxiliar 2",
      submenu: BASE_SECRETARIA_AUXILIAR_2,
    },
  ],
  ASISTENTE_EJECUTIVA: [
    {
      label: "Crear Oficios",
      submenu: [
        {
          label: "Control de Folios",
          path: "/asistente-ejecutiva/controlFolios",
        },
        { label: "Formatos Word", path: "/asistente-ejecutiva/formatos" },
      ],
    },
    {
      label: "Secretaría de Consejo",
      submenu: BASE_SECRETARIA_CONSEJO,
    },
    {
      label: "Secretaría Auxiliar 1",
      submenu: BASE_SECRETARIA_AUXILIAR_1,
    },
    {
      label: "Secretaría Auxiliar 2",
      submenu: BASE_SECRETARIA_AUXILIAR_2,
    },
  ],
};
