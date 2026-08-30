"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo, Suspense } from "react";
import { Container, Box, CircularProgress } from "@mui/material";
import Navbar from "../../components/Navbar";
import GenericTable, { ColumnConfig } from "../../components/GenericTable";
import { usePride } from "../../hooks/useEspecialPride";
import BannerInstitucional from "../../components/BannerInstitucional";
import { calcularUrgenciaPorFechas } from "../../utils/alertasFechas";
import {
  useAlertasCampana,
  AlertaCampana,
} from "../../context/AlertasCampanaContext";

export interface EspecialPrideRow {
  _id?: string;
  nombre: string;
  fuente_designacion: string;
  inicio: string;
  final: string;
  periodo: string;
  observaciones: string;
  urgencia?: string;
  [key: string]: any;
}

const columnasEspecialPride: ColumnConfig<EspecialPrideRow>[] = [
  { key: "urgencia", label: "Urgencia", hidden: true },
  { key: "nombre", label: "Nombre" },
  { key: "fuente_designacion", label: "Fuente de Designación" },
  { key: "inicio", label: "Fecha Inicio", type: "date" },
  { key: "final", label: "Fecha Término", type: "date" },
  { key: "periodo", label: "Periodo" },
  { key: "observaciones", label: "Observaciones" },
];

function ComisionEspecialPrideContent() {
  const [rolUsuario, setRolUsuario] = useState<string>("");
  const { registrarAlertas } = useAlertasCampana();

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  // Asistente Ejecutiva es solo consulta: no puede agregar/editar/eliminar
  const esSoloConsulta = rolUsuario === "ASISTENTE_EJECUTIVA";

  // Consumimos el hook pasando la ruta exacta del backend
  const { datos, cargando, agregarRegistro, editarRegistro, eliminarRegistro } =
    usePride<EspecialPrideRow>("especialPride");

  const datosConUrgenciaAutomatica = useMemo(
    () =>
      (datos as EspecialPrideRow[]).map((item) => ({
        ...item,
        urgencia: calcularUrgenciaPorFechas(
          item.final as string | Date | undefined,
        ),
      })),
    [datos],
  );

  // Sincronizamos las alertas evaluando la urgencia real con tu función centralizada
  useEffect(() => {
    console.log(
      "📥 [Página Especial PRIDE] Datos recibidos del backend:",
      datos,
    );

    if (!datos || datos.length === 0) {
      console.log(
        "⚠️ [Página Especial PRIDE] No hay datos o el arreglo está vacío.",
      );
      return;
    }

    const nuevasAlertas: AlertaCampana[] = [];

    (datos as EspecialPrideRow[]).forEach((item, index) => {
      const fechaTermino = item.final;
      if (!fechaTermino) return;

      // Usamos tu función existente para saber exactamente la urgencia
      const urgenciaCalculada = calcularUrgenciaPorFechas(fechaTermino);
      console.log(
        `🔎 [Item ${index}] Nombre: "${item.nombre}" | Fecha: "${fechaTermino}" | Urgencia: "${urgenciaCalculada}"`,
      );

      // Si la urgencia NO es normal (es decir, vencido, critico o advertencia), generamos la alerta
      if (urgenciaCalculada !== "normal") {
        let tipoAlerta: "alerta" | "aviso" = "aviso";
        let mensajeEstado = "está próximo a vencer";

        if (urgenciaCalculada === "vencido") {
          tipoAlerta = "alerta";
          mensajeEstado = "ya venció";
        } else if (urgenciaCalculada === "critico") {
          tipoAlerta = "alerta";
          mensajeEstado = "está en nivel crítico (menos de 3 meses)";
        } else if (urgenciaCalculada === "advertencia") {
          tipoAlerta = "aviso";
          mensajeEstado = "está en periodo de advertencia (menos de 6 meses)";
        }

        nuevasAlertas.push({
          id: Number(`9103${index}`),
          tipo: tipoAlerta,
          texto: `El miembro "${item.nombre || "Sin nombre"}" en Comisión Especial PRIDE ${mensajeEstado} (${fechaTermino}).`,
          tablaOrigen: "Comisión Especial PRIDE",
          accion: "miembros",
        });
      }
    });

    console.log(
      "🚨 [Página Especial PRIDE] Alertas listas para registrar:",
      nuevasAlertas,
    );
    registrarAlertas("Comisión Especial PRIDE", nuevasAlertas);
  }, [datos, registrarAlertas]);
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar rol={rolUsuario} />
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3, md: 4 } }}
      >
        <BannerInstitucional titulo="Comisión Especial PRIDE" />

        {cargando ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "#ee9105" }} />
          </Box>
        ) : (
          <GenericTable<EspecialPrideRow>
            data={datosConUrgenciaAutomatica}
            rowKey="_id"
            displayField="nombre"
            columns={columnasEspecialPride}
            title="Detalles - Comisión Especial PRIDE"
            addTitle="Registrar Nuevo Miembro"
            editTitle="Modificar Ficha del Miembro"
            readOnly={esSoloConsulta}
            onAdd={(newRow) => {
              const { urgencia, ...datosLimpios } = newRow;
              agregarRegistro(datosLimpios);
            }}
            onEdit={(row) => {
              if (row._id) {
                const { urgencia, ...datosLimpios } = row;
                editarRegistro(row._id, datosLimpios);
              }
            }}
            onDelete={(row) => row._id && eliminarRegistro(row._id)}
          />
        )}
      </Container>
    </Box>
  );
}

export default function ComisionEspecialPridePage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress sx={{ color: "#ee9105" }} />
        </Box>
      }
    >
      <ComisionEspecialPrideContent />
    </Suspense>
  );
}
