import { useAlertasCampana } from "../context/AlertasCampanaContext";

export function useNotifications(
  rol?: string,
  datosTabla?: any[],
  nombreTabla?: string,
) {
  const {
    notificaciones,
    totalAlertas,
    tieneAlertasActivas,
    posponerNotificacion,
    irAMiembros,
  } = useAlertasCampana();

  return {
    listaNotif: notificaciones,
    totalAlertas,
    tieneAlertasActivas,
    posponerNotificacion,
    irAMiembros,
  };
}
