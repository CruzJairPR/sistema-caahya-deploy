import { useEffect, useMemo } from "react";
import { useAlertasCampana } from "../context/AlertasCampanaContext";
import { calcularUrgenciaPorFechas } from "../utils/alertasFechas";
import { AlertaCampana, TablaOrigen } from "../types/alertas";

interface ConfigAlertaAgrupada<T> {
  id: number;
  rol: string;
  tablaOrigen: TablaOrigen;
  etiqueta?: string;

  obtenerFechaTermino: (item: T) => string | Date | undefined;
}

interface AlertasCampanaContextValue {
  registrarAlertas: (
    tablaOrigen: TablaOrigen,
    alertas: AlertaCampana[],
  ) => void;
}

interface UseDatosResult<T> {
  datos: T[] | undefined;
  cargando?: boolean;
}

export function crearHookAlertaAgrupada<T>(
  config: ConfigAlertaAgrupada<T>,
  useDatos: () => UseDatosResult<T>,
) {
  return function useAlertaAgrupada(rolUsuario: string) {
    const context = useAlertasCampana() as AlertasCampanaContextValue;
    const { registrarAlertas } = context;
    const { datos, cargando } = useDatos();

    const itemsConUrgencia = useMemo(() => {
      if (!datos) return [];
      return datos.map((item) => ({
        item,
        urgencia: calcularUrgenciaPorFechas(config.obtenerFechaTermino(item)),
      }));
    }, [datos]);

    useEffect(() => {
      const rolActual = (rolUsuario || "").toLowerCase();
      const rolRequerido = (config.rol || "").toLowerCase();

      const esRolValido =
        rolActual === rolRequerido ||
        rolActual === "coordinadora" ||
        rolActual === "admin";

      if (!esRolValido) return;
      if (cargando) return;

      if (!datos) {
        registrarAlertas(config.tablaOrigen, []);
        return;
      }

      const itemsProximos = itemsConUrgencia.filter(({ urgencia }) =>
        ["critico", "advertencia", "vencido"].includes(urgencia),
      );

      const criticosCount = itemsProximos.filter(
        ({ urgencia }) => urgencia === "critico" || urgencia === "vencido",
      ).length;

      const alertas: AlertaCampana[] =
        itemsProximos.length > 0
          ? [
              {
                id: config.id,
                texto:
                  criticosCount > 0
                    ? `⚠️ Tienes ${itemsProximos.length} registros próximos a vencer en  ${config.tablaOrigen} (${criticosCount} en estado crítico).`
                    : `⚠️ Tienes ${itemsProximos.length} registros que requieren atención en  ${config.tablaOrigen}.`,
                tipo: criticosCount > 0 ? "alerta" : "info",
                accion: "miembros",
                tablaOrigen: config.tablaOrigen,
              },
            ]
          : [];

      registrarAlertas(config.tablaOrigen, alertas);
    }, [rolUsuario, itemsConUrgencia, cargando, registrarAlertas, datos]);
  };
}
