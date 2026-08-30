import { useAlertaDifusion } from "./useAlertasDifusion";
import {
  useAlertaLenguas,
  useAlertaLenguasCoordinadores,
} from "./useAlertasLenguas";
import {
  useAlertaCarreraArquitectura,
  useAlertaCarreraDiseno,
  useAlertaCarreraDesarrolloGestion,
  useAlertaCarreraFilosofia,
  useAlertaCarreraHistoria,
  useAlertaCarreraPedagogia,
} from "./useAlertasCarreras";

export function useGlobalAlertasSecretariaAux2(rolUsuario: string) {
  useAlertaDifusion(rolUsuario);
  useAlertaLenguas(rolUsuario);
  useAlertaLenguasCoordinadores(rolUsuario);
  useAlertaCarreraArquitectura(rolUsuario);
  useAlertaCarreraDiseno(rolUsuario);
  useAlertaCarreraDesarrolloGestion(rolUsuario);
  useAlertaCarreraFilosofia(rolUsuario);
  useAlertaCarreraHistoria(rolUsuario);
  useAlertaCarreraPedagogia(rolUsuario);
}
