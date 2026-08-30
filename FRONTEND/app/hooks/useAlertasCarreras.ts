import { crearHookAlertaAgrupada } from "./useAlertasFactory";
import { useCarreras } from "./useCarreras";

function crearUseCarreraData(endpoint: string) {
  return function useCarreraData() {
    return useCarreras(endpoint);
  };
}

export const useAlertaCarreraArquitectura = crearHookAlertaAgrupada(
  {
    id: 9200,
    rol: "SECRETARIA_AUXILIAR_2",
    tablaOrigen: "Comité de Carrera Arquitectura",
    obtenerFechaTermino: (item: any) => item.fechaTermino,
  },
  crearUseCarreraData("arquitectura"),
);

export const useAlertaCarreraDiseno = crearHookAlertaAgrupada(
  {
    id: 9201,
    rol: "SECRETARIA_AUXILIAR_2",
    tablaOrigen: "Comité de Carrera de Diseño",
    obtenerFechaTermino: (item: any) => item.fechaTermino,
  },
  crearUseCarreraData("diseno"),
);

export const useAlertaCarreraDesarrolloGestion = crearHookAlertaAgrupada(
  {
    id: 9202,
    rol: "SECRETARIA_AUXILIAR_2",
    tablaOrigen: "Comité de Carrera de Desarrollo y Gestión Intelectual",
    obtenerFechaTermino: (item: any) => item.fechaTermino,
  },
  crearUseCarreraData("desarrolloGestion"),
);

export const useAlertaCarreraFilosofia = crearHookAlertaAgrupada(
  {
    id: 9203,
    rol: "SECRETARIA_AUXILIAR_2",
    tablaOrigen: "Comité de Carrera de Filosofía",
    obtenerFechaTermino: (item: any) => item.fechaTermino,
  },
  crearUseCarreraData("filosofia"),
);

export const useAlertaCarreraHistoria = crearHookAlertaAgrupada(
  {
    id: 9204,
    rol: "SECRETARIA_AUXILIAR_2",
    tablaOrigen: "Comité de Carrera de Historia",
    obtenerFechaTermino: (item: any) => item.fechaTermino,
  },
  crearUseCarreraData("historia"),
);

export const useAlertaCarreraPedagogia = crearHookAlertaAgrupada(
  {
    id: 9205,
    rol: "SECRETARIA_AUXILIAR_2",
    tablaOrigen: "Comité de Carrera de Pedagogía",
    obtenerFechaTermino: (item: any) => item.fechaTermino,
  },
  crearUseCarreraData("pedagogia"),
);
