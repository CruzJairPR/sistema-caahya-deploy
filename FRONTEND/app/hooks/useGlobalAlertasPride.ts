import { useEffect } from "react";
import {
  useAlertasCampana,
  AlertaCampana,
} from "../context/AlertasCampanaContext";
import { calcularUrgenciaPorFechas } from "../utils/alertasFechas";

export function useGlobalAlertasPride(perfilActivo: string) {
  const { registrarAlertas } = useAlertasCampana();

  useEffect(() => {
    const rolLimpio = (perfilActivo || "").toLowerCase().replace(/\s+/g, "_");

    // Validamos si el perfil actual tiene permitido ver las alertas PRIDE
    // (Secretaría de Consejo, Coordinadora o Admin)
    const esValidoParaPride =
      rolLimpio === "secretaria_consejo" ||
      rolLimpio === "secretariaconsejo" ||
      rolLimpio === "coordinadora" ||
      rolLimpio === "admin";

    if (!esValidoParaPride) {
      // ⚠️ LIMPIEZA CRÍTICA: Si el usuario cambia a Secretaría Auxiliar 1 o 2,
      // borramos estas alertas de la campana pasando un arreglo vacío [].
      registrarAlertas("Comisión Especial PRIDE", []);
      registrarAlertas("Comisión Revisadora PRIDE", []);
      return;
    }

    const procesarAlertasAgrupadas = async (
      endpoint: string,
      nombreTabla: "Comisión Especial PRIDE" | "Comisión Revisadora PRIDE",
      idBase: number,
    ) => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const response = await fetch(`${baseUrl}/api/v1/${endpoint}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          console.warn(`⚠️ Error HTTP ${response.status} en ${endpoint}`);
          return;
        }

        const datos = await response.json();
        if (!Array.isArray(datos)) return;

        let criticos = 0; // Rojos (vencidos / críticos)
        let advertencias = 0; // Amarillos

        datos.forEach((item: any) => {
          const fechaTermino = item.final || item.Termino || item.fechaTermino;
          if (!fechaTermino) return;

          const urgencia = calcularUrgenciaPorFechas(fechaTermino);
          if (urgencia === "vencido" || urgencia === "critico") {
            criticos++;
          } else if (urgencia === "advertencia") {
            advertencias++;
          }
        });

        const nuevasAlertas: AlertaCampana[] = [];

        // Generar notificación de CRÍTICOS (Rojo) agrupada
        if (criticos > 0) {
          nuevasAlertas.push({
            id: idBase + 1,
            tipo: "alerta",
            texto: `${criticos} registros requieren atención urgente (vencidos/críticos) en ${nombreTabla}.`,
            tablaOrigen: nombreTabla,
            accion: "miembros",
          });
        }

        // Generar notificación de ADVERTENCIAS (Amarillo) agrupada
        if (advertencias > 0) {
          nuevasAlertas.push({
            id: idBase + 2,
            tipo: "aviso",
            texto: `${advertencias} registros próximos a vencer en ${nombreTabla}.`,
            tablaOrigen: nombreTabla,
            accion: "miembros",
          });
        }

        registrarAlertas(nombreTabla, nuevasAlertas);
      } catch (e) {
        console.error(`❌ Excepción al cargar ${nombreTabla}:`, e);
      }
    };

    // Ejecutar procesamiento solo si el rol es válido
    procesarAlertasAgrupadas("especialPride", "Comisión Especial PRIDE", 9000);
    procesarAlertasAgrupadas(
      "revisadoraPride",
      "Comisión Revisadora PRIDE",
      9100,
    );
  }, [perfilActivo, registrarAlertas]);
}
