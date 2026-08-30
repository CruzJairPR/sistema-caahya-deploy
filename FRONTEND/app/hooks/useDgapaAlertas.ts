import { crearHookAlertaAgrupada } from "./useAlertasFactory";
import { useCatalogo } from "./useCatalogo";
import { ComisionDGAPA } from "../types/catalogo";
import { PESTANHAS_DGAPA } from "../config/dgapaTabs";

// Adaptador: fija el tabValue para que el resultado sea un hook sin argumentos,
// tal como lo espera crearHookAlertaAgrupada.
function crearUseDgapaCategoriaData(tabValue: string) {
  return function useDgapaCategoriaData() {
    return useCatalogo<ComisionDGAPA>(tabValue, "dgapaGeneral");
  };
}

// Un hook de alerta agrupada por cada categoría DGAPA, id = 9100 + índice
// (mismo esquema que ya usaba el componente original).
export const useAlertaPapiitComite = crearHookAlertaAgrupada(
  {
    id: 9100,
    rol: "SECRETARIA_AUXILIAR_1",
    tablaOrigen: PESTANHAS_DGAPA[0].label,
    obtenerFechaTermino: (item: any) => item.Termino,
  },
  crearUseDgapaCategoriaData(PESTANHAS_DGAPA[0].value),
);

export const useAlertaPapiitInvAplicada = crearHookAlertaAgrupada(
  {
    id: 9101,
    rol: "SECRETARIA_AUXILIAR_1",
    tablaOrigen: PESTANHAS_DGAPA[1].label,
    obtenerFechaTermino: (item: any) => item.Termino,
  },
  crearUseDgapaCategoriaData(PESTANHAS_DGAPA[1].value),
);

export const useAlertaPapiitProyectosGrupo = crearHookAlertaAgrupada(
  {
    id: 9102,
    rol: "SECRETARIA_AUXILIAR_1",
    tablaOrigen: PESTANHAS_DGAPA[2].label,
    obtenerFechaTermino: (item: any) => item.Termino,
  },
  crearUseDgapaCategoriaData(PESTANHAS_DGAPA[2].value),
);

export const useAlertaPapiitInfraestructura = crearHookAlertaAgrupada(
  {
    id: 9103,
    rol: "SECRETARIA_AUXILIAR_1",
    tablaOrigen: PESTANHAS_DGAPA[3].label,
    obtenerFechaTermino: (item: any) => item.Termino,
  },
  crearUseDgapaCategoriaData(PESTANHAS_DGAPA[3].value),
);

export const useAlertaPapime = crearHookAlertaAgrupada(
  {
    id: 9104,
    rol: "SECRETARIA_AUXILIAR_1",
    tablaOrigen: PESTANHAS_DGAPA[4].label,
    obtenerFechaTermino: (item: any) => item.Termino,
  },
  crearUseDgapaCategoriaData(PESTANHAS_DGAPA[4].value),
);

export const useAlertaPaspa = crearHookAlertaAgrupada(
  {
    id: 9105,
    rol: "SECRETARIA_AUXILIAR_1",
    tablaOrigen: PESTANHAS_DGAPA[5].label,
    obtenerFechaTermino: (item: any) => item.Termino,
  },
  crearUseDgapaCategoriaData(PESTANHAS_DGAPA[5].value),
);

export const useAlertaBecasPosdoc = crearHookAlertaAgrupada(
  {
    id: 9106,
    rol: "SECRETARIA_AUXILIAR_1",
    tablaOrigen: PESTANHAS_DGAPA[6].label,
    obtenerFechaTermino: (item: any) => item.Termino,
  },
  crearUseDgapaCategoriaData(PESTANHAS_DGAPA[6].value),
);

export const useAlertaPasd = crearHookAlertaAgrupada(
  {
    id: 9107,
    rol: "SECRETARIA_AUXILIAR_1",
    tablaOrigen: PESTANHAS_DGAPA[7].label,
    obtenerFechaTermino: (item: any) => item.Termino,
  },
  crearUseDgapaCategoriaData(PESTANHAS_DGAPA[7].value),
);
