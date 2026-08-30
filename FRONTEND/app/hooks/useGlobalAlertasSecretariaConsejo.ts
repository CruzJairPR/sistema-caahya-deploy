import { useEffect } from "react";
import {
  useAlertasCampana,
  AlertaCampana,
} from "../context/AlertasCampanaContext";

export function useGlobalAlertasSecretariaConsejo(perfilActivo: string) {
  const { registrarAlertas } = useAlertasCampana();

  useEffect(() => {
    // Si aún no carga el perfil (viene vacío), no hacemos nada
    if (!perfilActivo) {
      return;
    }

    const rolLimpio = perfilActivo.toLowerCase().replace(/\s+/g, "_");
    const esValido =
      rolLimpio === "secretaria_consejo" ||
      rolLimpio === "secretariaconsejo" ||
      rolLimpio === "coordinadora" ||
      rolLimpio === "admin";

    if (!esValido) {
      registrarAlertas("Comisión Revisadora PRIDE", []);
      registrarAlertas("Comisión Especial PRIDE", []);
      return;
    }

    // Función auxiliar para buscar en todo el localStorage por fragmentos de clave
    const buscarDatosFlexibles = (palabrasClave: string[]) => {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const keyLower = key.toLowerCase();
            if (palabrasClave.every((p) => keyLower.includes(p))) {
              const item = localStorage.getItem(key);
              if (item) {
                const parsed = JSON.parse(item);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  console.log(
                    `📦 [LocalStorage] Encontrado en llave '${key}':`,
                    parsed,
                  );
                  return parsed;
                }
              }
            }
          }
        }
      } catch (e) {
        console.error("Error buscando en localStorage:", e);
      }
      return [];
    };

    // ==========================================
    // 1. Comisión Revisadora PRIDE
    // ==========================================
    try {
      const itemsRevisadora = buscarDatosFlexibles(["revisadora"]);
      const nuevasAlertasRevisadora: AlertaCampana[] = [];

      itemsRevisadora.forEach((item: any, index: number) => {
        const fechaLimite =
          item.Termino ||
          item.termino ||
          item.final ||
          item.fechaTermino ||
          item.fecha ||
          item.Vencimiento;

        if (fechaLimite) {
          const hoy = new Date();
          const limite = new Date(fechaLimite);

          if (!isNaN(limite.getTime())) {
            const diferenciaDias = Math.ceil(
              (limite.getTime() - hoy.getTime()) / (1000 * 3600 * 24),
            );

            if (diferenciaDias <= 5) {
              nuevasAlertasRevisadora.push({
                id: Number(`${9102}${index}`),
                tipo: diferenciaDias <= 0 ? "alerta" : "aviso",
                texto: `El registro "${
                  item.nombre ||
                  item.titulo ||
                  item.Entidad ||
                  item.miembro ||
                  "Sin nombre"
                }" está próximo a vencer o venció (${fechaLimite}).`,
                tablaOrigen: "Comisión Revisadora PRIDE",
                accion: "miembros",
              });
            }
          }
        }
      });

      registrarAlertas("Comisión Revisadora PRIDE", nuevasAlertasRevisadora);
    } catch (e) {
      console.error("Error procesando Comisión Revisadora PRIDE", e);
    }

    // ==========================================
    // 2. Comisión Especial PRIDE
    // ==========================================
    try {
      const itemsEspecial = buscarDatosFlexibles(["especial"]);
      const nuevasAlertasEspecial: AlertaCampana[] = [];

      itemsEspecial.forEach((item: any, index: number) => {
        const fechaLimite =
          item.Termino ||
          item.termino ||
          item.final ||
          item.fechaTermino ||
          item.fecha ||
          item.Vencimiento;

        if (fechaLimite) {
          const hoy = new Date();
          const limite = new Date(fechaLimite);

          if (!isNaN(limite.getTime())) {
            const diferenciaDias = Math.ceil(
              (limite.getTime() - hoy.getTime()) / (1000 * 3600 * 24),
            );

            if (diferenciaDias <= 5) {
              nuevasAlertasEspecial.push({
                id: Number(`${9103}${index}`),
                tipo: diferenciaDias <= 0 ? "alerta" : "aviso",
                texto: `El registro "${
                  item.nombre ||
                  item.titulo ||
                  item.Entidad ||
                  item.miembro ||
                  "Sin nombre"
                }" está próximo a vencer o venció (${fechaLimite}).`,
                tablaOrigen: "Comisión Especial PRIDE",
                accion: "miembros",
              });
            }
          }
        }
      });

      registrarAlertas("Comisión Especial PRIDE", nuevasAlertasEspecial);
    } catch (e) {
      console.error("Error procesando Comisión Especial PRIDE", e);
    }
  }, [perfilActivo, registrarAlertas]);
}
