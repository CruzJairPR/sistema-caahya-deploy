import { crearHookAlertaAgrupada } from "./useAlertasFactory";
import { useSubcomisionLenguas } from "./useSubcomisionLenguas";

export const useAlertaLenguas = crearHookAlertaAgrupada(
  {
    id: 9210,
    rol: "SECRETARIA_AUXILIAR_2",
    tablaOrigen: "Comisión Especial de Lenguas",
    etiqueta: "Miembros de la Comisión Especial de Lenguas",
    obtenerFechaTermino: (item: any) => item.periodo_integrante?.fecha_final,
  },
  useSubcomisionLenguas,
);

// Adaptador: filtra solo coordinadores para que crearHookAlertaAgrupada
// evalúe la fecha de término de la coordinación, no del período general.
function useSubcomisionLenguasCoordinadores() {
  const resultado = useSubcomisionLenguas();
  const datosCoordinadores = (resultado.datos || []).filter(
    (item: any) =>
      item.coordinacion?.es_coordinador === true ||
      item.coordinacion?.es_coordinador === "true",
  );
  return { ...resultado, datos: datosCoordinadores };
}

export const useAlertaLenguasCoordinadores = crearHookAlertaAgrupada(
  {
    id: 9211,
    rol: "SECRETARIA_AUXILIAR_2",
    tablaOrigen: "Comisión Especial de Lenguas - Coordinadores",
    etiqueta: "Miembros de la Comisión Especial de Lenguas",

    obtenerFechaTermino: (item: any) => item.coordinacion?.fecha_final,
  },
  useSubcomisionLenguasCoordinadores,
);
