export interface SearchResult {
  id: string;
  titulo: string;
  subtitulo: string;
  modulo: string;
  path: string;
  rolesPermitidos: string[];
}

const DATA_SISTEMA: SearchResult[] = [
  {
    id: "M1",
    titulo: "Dr. Alejandro Ortega",
    subtitulo: "Consejero Técnico - Vence: 15/09/2026",
    modulo: "Miembros del Consejo",
    path: "/miembros",
    rolesPermitidos: ["SECRETARIA_CONSEJO", "COORDINADORA"],
  },
  {
    id: "M2",
    titulo: "Dra. Beatriz Cuevas",
    subtitulo: "Consejera de Facultad - Vence: 20/05/2027",
    modulo: "Miembros del Consejo",
    path: "/miembros",
    rolesPermitidos: ["SECRETARIA_CONSEJO", "COORDINADORA"],
  },
  {
    id: "O124",
    titulo: "Oficio 124-B",
    subtitulo: "Estado: Pendiente de firma - Área: Dirección",
    modulo: "Oficios y Correspondencia",
    path: "/oficios",
    rolesPermitidos: [
      "SECRETARIA_AUXILIAR_1",
      "ASISTENTE_EJECUTIVA",
      "COORDINADORA",
    ],
  },
  {
    id: "D45",
    titulo: "Dictamen Comisión de Lenguas",
    subtitulo: "Aprobado - Fecha: 10/04/2026",
    modulo: "Comisiones Dictaminadoras",
    path: "/dictamenes",
    rolesPermitidos: [
      "SECRETARIA_AUXILIAR_1",
      "SECRETARIA_AUXILIAR_2",
      "COORDINADORA",
    ],
  },
];

export const buscarEnSistema = (
  query: string,
  userRole: string,
): SearchResult[] => {
  if (!query.trim() || !userRole) return [];

  const cleanQuery = query.toLowerCase().trim();

  return DATA_SISTEMA.filter((item) => {
    const tieneAcceso =
      userRole === "COORDINADORA" || item.rolesPermitidos.includes(userRole);
    if (!tieneAcceso) return false;

    return (
      item.titulo.toLowerCase().includes(cleanQuery) ||
      item.subtitulo.toLowerCase().includes(cleanQuery) ||
      item.modulo.toLowerCase().includes(cleanQuery)
    );
  });
};
