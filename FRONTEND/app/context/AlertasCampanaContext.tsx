"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { saveToHistory } from "../utils/history";
import { AlertaCampana, TablaOrigen } from "../types/alertas";

export type { AlertaCampana } from "../types/alertas";

interface AlertasCampanaContextType {
  notificaciones: AlertaCampana[];
  totalAlertas: number;
  tieneAlertasActivas: boolean;
  registrarAlertas: (
    tablaOrigen: TablaOrigen,
    nuevasAlertas: AlertaCampana[],
  ) => void;
  posponerNotificacion: (id: number) => void;
  irAMiembros: (
    labelHistorial: string,
    onCloseCallback: () => void,
    tablaOrigen?: TablaOrigen,
  ) => void;
}

const AlertasCampanaContext = createContext<
  AlertasCampanaContextType | undefined
>(undefined);

export const AlertasCampanaProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState<AlertaCampana[]>([]);
  const [idsPospuestos, setIdsPospuestos] = useState<Set<number>>(new Set());

  const registrarAlertas = useCallback(
    (tablaOrigen: TablaOrigen, nuevasAlertas: AlertaCampana[]) => {
      setNotificaciones((prev) => {
        const alertasPersistentes = prev.filter(
          (n) => n.tablaOrigen !== tablaOrigen,
        );

        const alertasFiltradas = nuevasAlertas.filter(
          (n) => !idsPospuestos.has(n.id),
        );

        const nuevasCompletas = [...alertasPersistentes, ...alertasFiltradas];

        if (
          prev.length === nuevasCompletas.length &&
          prev.every((item, index) => item.id === nuevasCompletas[index]?.id)
        ) {
          return prev;
        }

        return nuevasCompletas;
      });
    },
    [idsPospuestos],
  );

  const posponerNotificacion = useCallback((id: number) => {
    setIdsPospuestos((prev) => new Set(prev).add(id));
    setNotificaciones((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              texto: "⏰ Alerta de renovación pospuesta",
              tipo: "info" as const,
              accion: "ninguna" as const,
              tablaOrigen: undefined,
            }
          : n,
      ),
    );
  }, []);

  const irAMiembros = useCallback(
    (
      labelHistorial: string,
      onCloseCallback: () => void,
      tablaOrigen?: TablaOrigen,
    ) => {
      const rutasConfig: Record<TablaOrigen, { url: string; tab: string }> = {
        "Comisiones Dictaminadoras": {
          url: "/secretaria-aux1/comisionesDictaminadora",
          tab: "activas",
        },
        "Comision Evaluadora PRIDE": {
          url: "/secretaria-aux1/evaluadorasPride",
          tab: "activas",
        },
        "PAPIIT Comite Evaluador": {
          url: "/secretaria-aux1/comisionesDGAPA",
          tab: "papiit_comite_evaluador",
        },
        "PAPIIT Inv Aplicada": {
          url: "/secretaria-aux1/comisionesDGAPA",
          tab: "papiit_inv_aplicada",
        },
        "PAPIIT Proyectos de Grupo": {
          url: "/secretaria-aux1/comisionesDGAPA",
          tab: "papiit_proyectos_de_grupo",
        },
        "PAPIIT Infraestructura academica": {
          url: "/secretaria-aux1/comisionesDGAPA",
          tab: "papiit_infraestructura_academica",
        },
        PAPIME: { url: "/secretaria-aux1/comisionesDGAPA", tab: "papime" },
        PASPA: { url: "/secretaria-aux1/comisionesDGAPA", tab: "paspa" },
        "Becas Posdoctorales": {
          url: "/secretaria-aux1/comisionesDGAPA",
          tab: "becas_posdoc",
        },
        PASD: { url: "/secretaria-aux1/comisionesDGAPA", tab: "pasd" },
        "Plan de Estudios": {
          url: "/secretaria-aux1/comisionesDGAPA",
          tab: "plan_de_estudios",
        },
        SUAyED: { url: "/secretaria-aux1/comisionesDGAPA", tab: "suayed" },
        "Comisión Revisadora PRIDE": {
          url: "/secretaria-consejo/comisionRevisadoraPride",
          tab: "",
        },
        "Comisión Especial PRIDE": {
          url: "/secretaria-consejo/comisionEspecialPride",
          tab: "",
        },
        "Directorio de Entidades": {
          url: "/secretaria-aux1/comisionesDGAPA",
          tab: "directorio_entidades",
        },
        "Comité de Carreras": {
          url: "/secretaria-aux2/comiteCarreras/arquitectura",
          tab: "",
        },
        "Comité de Carrera Arquitectura": {
          url: "/secretaria-aux2/comiteCarreras/arquitectura",
          tab: "",
        },
        "Comité de Carrera de Diseño": {
          url: "/secretaria-aux2/comiteCarreras/diseno",
          tab: "",
        },
        "Comité de Carrera de Desarrollo y Gestión Intelectual": {
          url: "/secretaria-aux2/comiteCarreras/desarrolloGestion",
          tab: "",
        },
        "Comité de Carrera de Filosofía": {
          url: "/secretaria-aux2/comiteCarreras/filosofia",
          tab: "",
        },
        "Comité de Carrera de Historia": {
          url: "/secretaria-aux2/comiteCarreras/historia",
          tab: "",
        },
        "Comité de Carrera de Pedagogía": {
          url: "/secretaria-aux2/comiteCarreras/pedagogia",
          tab: "",
        },
        "Comisión Especial de Lenguas": {
          url: "/secretaria-aux2/comisionEspecialLenguas",
          tab: "",
        },
        "Comisión de Difusión y Extensión": {
          url: "/secretaria-aux2/comisionDifusionExtension",
          tab: "",
        },
        "Comisión Especial de Lenguas - Coordinadores": {
          url: "/secretaria-aux2/comisionEspecialLenguas",
          tab: "",
        },
      };

      const config = tablaOrigen ? rutasConfig[tablaOrigen] : undefined;

      if (tablaOrigen && !config) {
        console.warn(
          `irAMiembros: no hay ruta configurada para tablaOrigen="${tablaOrigen}"`,
        );
      }

      const urlDestino = config
        ? config.url
        : "/secretaria-aux1/comisionesDGAPA";
      const tabDestino = config ? config.tab : "";

      saveToHistory(labelHistorial, urlDestino);

      if (tabDestino) {
        router.push(`${urlDestino}?tab=${tabDestino}`);
      } else {
        router.push(urlDestino);
      }

      onCloseCallback();
    },
    [router],
  );

  const totalAlertas = useMemo(
    () => notificaciones.filter((n) => n.tipo === "alerta").length,
    [notificaciones],
  );
  const tieneAlertasActivas = useMemo(
    () => notificaciones.some((n) => n.tipo === "alerta"),
    [notificaciones],
  );

  const value = useMemo(
    () => ({
      notificaciones,
      totalAlertas,
      tieneAlertasActivas,
      registrarAlertas,
      posponerNotificacion,
      irAMiembros,
    }),
    [
      notificaciones,
      totalAlertas,
      tieneAlertasActivas,
      registrarAlertas,
      posponerNotificacion,
      irAMiembros,
    ],
  );

  return (
    <AlertasCampanaContext.Provider value={value}>
      {children}
    </AlertasCampanaContext.Provider>
  );
};

export const useAlertasCampana = () => {
  const context = useContext(AlertasCampanaContext);
  if (!context) {
    throw new Error(
      "useAlertasCampana debe usarse dentro de un AlertasCampanaProvider",
    );
  }
  return context;
};
