import { crearHookAlertaAgrupada } from "./useAlertasFactory";
import { useEvaluadorasPride } from "./useEvaluadorasPride";
import { useComisionesDictaminadorasData } from "./useComisionesDictaminadorasData";
import {
  useAlertaPapiitComite,
  useAlertaPapiitInvAplicada,
  useAlertaPapiitProyectosGrupo,
  useAlertaPapiitInfraestructura,
  useAlertaPapime,
  useAlertaPaspa,
  useAlertaBecasPosdoc,
  useAlertaPasd,
} from "./useDgapaAlertas";

const useAlertaPride = crearHookAlertaAgrupada(
  {
    id: 9001,
    rol: "SECRETARIA_AUXILIAR_1",
    tablaOrigen: "Comision Evaluadora PRIDE",
    obtenerFechaTermino: (item: any) => item.Termino || item.termino,
  },
  useEvaluadorasPride,
);

const useAlertaDictaminadoras = crearHookAlertaAgrupada(
  {
    id: 9000,
    rol: "SECRETARIA_AUXILIAR_1",
    tablaOrigen: "Comisiones Dictaminadoras",
    obtenerFechaTermino: (item: any) => item.Termino,
  },
  useComisionesDictaminadorasData,
);

export function useGlobalAlertasSecretaria1(rolUsuario: string) {
  useAlertaPride(rolUsuario);
  useAlertaDictaminadoras(rolUsuario);
  useAlertaPapiitComite(rolUsuario);
  useAlertaPapiitInvAplicada(rolUsuario);
  useAlertaPapiitProyectosGrupo(rolUsuario);
  useAlertaPapiitInfraestructura(rolUsuario);
  useAlertaPapime(rolUsuario);
  useAlertaPaspa(rolUsuario);
  useAlertaBecasPosdoc(rolUsuario);
  useAlertaPasd(rolUsuario);
}
