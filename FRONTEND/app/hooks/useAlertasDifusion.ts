import { crearHookAlertaAgrupada } from "./useAlertasFactory";
import { useDifusion } from "./useDifusion";

export const useAlertaDifusion = crearHookAlertaAgrupada(
  {
    id: 9020,
    rol: "SECRETARIA_AUXILIAR_2",
    tablaOrigen: "Comisión de Difusión y Extensión",
    obtenerFechaTermino: (item: any) => item.fechaFin,
  },
  useDifusion,
);
