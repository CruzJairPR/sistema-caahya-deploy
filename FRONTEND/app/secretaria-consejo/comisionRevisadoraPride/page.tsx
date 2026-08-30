"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo, Suspense } from "react";
import { Container, Box, CircularProgress } from "@mui/material";
import Navbar from "../../components/Navbar";
import GenericTable, { ColumnConfig } from "../../components/GenericTable";
import { usePride } from "../../hooks/useEspecialPride";
import BannerInstitucional from "../../components/BannerInstitucional";
import { calcularUrgenciaPorFechas } from "../../utils/alertasFechas";

export interface RevisadoraPrideRow {
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

const columnasRevisadoraPride: ColumnConfig<RevisadoraPrideRow>[] = [
  { key: "urgencia", label: "Urgencia", hidden: true },
  { key: "nombre", label: "Nombre" },
  { key: "fuente_designacion", label: "Fuente de Designación" },
  { key: "inicio", label: "Fecha Inicio", type: "date" },
  { key: "final", label: "Fecha Término", type: "date" },
  { key: "periodo", label: "Periodo" },
  { key: "observaciones", label: "Observaciones" },
];

function ComisionRevisadoraPrideContent() {
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  // Asistente Ejecutiva es solo consulta: no puede agregar, modificar ni eliminar registros
  const esSoloConsulta = rolUsuario === "ASISTENTE_EJECUTIVA";

  // Consumimos el hook apuntando al endpoint de revisadora pride
  const { datos, cargando, agregarRegistro, editarRegistro, eliminarRegistro } =
    usePride<RevisadoraPrideRow>("revisadoraPride");

  const datosConUrgenciaAutomatica = useMemo(
    () =>
      (datos as RevisadoraPrideRow[]).map((item) => ({
        ...item,
        urgencia: calcularUrgenciaPorFechas(
          item.final as string | Date | undefined,
        ),
      })),
    [datos],
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar rol={rolUsuario} />
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3, md: 4 } }}
      >
        <BannerInstitucional titulo="Comisión Revisora PRIDE" />

        {cargando ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "#ee9105" }} />
          </Box>
        ) : (
          <GenericTable<RevisadoraPrideRow>
            data={datosConUrgenciaAutomatica}
            rowKey="_id"
            displayField="nombre"
            columns={columnasRevisadoraPride}
            title="Detalles - Comisión Revisadora PRIDE"
            addTitle="Registrar Nuevo Miembro"
            editTitle="Modificar Ficha del Miembro"
            readOnly={esSoloConsulta}
            onAdd={
              esSoloConsulta
                ? undefined
                : (newRow) => {
                    const { urgencia, ...datosLimpios } = newRow;
                    agregarRegistro(datosLimpios);
                  }
            }
            onEdit={
              esSoloConsulta
                ? undefined
                : (row) => {
                    if (row._id) {
                      const { urgencia, ...datosLimpios } = row;
                      editarRegistro(row._id, datosLimpios);
                    }
                  }
            }
            onDelete={
              esSoloConsulta
                ? undefined
                : (row) => row._id && eliminarRegistro(row._id)
            }
          />
        )}
      </Container>
    </Box>
  );
}

export default function ComisionRevisadoraPridePage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress sx={{ color: "#ee9105" }} />
        </Box>
      }
    >
      <ComisionRevisadoraPrideContent />
    </Suspense>
  );
}
