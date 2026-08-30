import { useEffect } from "react";
import { useAlertasPrideContext } from "../context/AlertasPrideContext";

export function useNotificationsPride(rol?: string, datosTabla?: any[]) {
  const {
    notificaciones,
    totalAlertas,
    tieneAlertasActivas,
    actualizarAlertasPride,
    posponerNotificacion,
    irAMiembros,
  } = useAlertasPrideContext();

  // Cada vez que los datos de la tabla cambien, actualizamos las alertas en el context
  useEffect(() => {
    if (datosTabla && datosTabla.length > 0) {
      actualizarAlertasPride(datosTabla);
    }
  }, [datosTabla]);

  return {
    listaNotif: notificaciones,
    totalAlertas,
    tieneAlertasActivas,
    posponerNotificacion,
    irAMiembros,
  };
}
