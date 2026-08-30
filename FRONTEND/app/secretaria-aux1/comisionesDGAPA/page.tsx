"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container, Box, CircularProgress, Tabs, Tab } from "@mui/material";
import Navbar from "../../components/Navbar";
import GenericTable, { ColumnConfig } from "../../components/GenericTable";
import { ComisionDGAPA } from "../../types/catalogo";
import { useCatalogo } from "../../hooks/useCatalogo";
import BannerInstitucional from "../../components/BannerInstitucional";
import { calcularUrgenciaPorFechas } from "../../utils/alertasFechas";
import { PESTANHAS_DGAPA } from "../../config/dgapaTabs";

type ComisionRow = ComisionDGAPA & {
  urgencia?: string;
  _id?: string;
};

const columnasComisiones: ColumnConfig<ComisionRow>[] = [
  { key: "urgencia", label: "Urgencia", hidden: true },
  { key: "Entidad", label: "Entidad" },
  { key: "Comision", label: "Comisión" },
  { key: "Miembro", label: "Miembro" },
  { key: "Fuente de Designacion", label: "Fuente de Designación" },
  { key: "Categoria y nivel", label: "Categoría" },
  { key: "Adscripcion", label: "Adscripción" },
  { key: "Area", label: "Area" },
  { key: "Periodo", label: "Periodo" },
  { key: "Inicio", label: "Fecha Inicio", type: "date" },
  { key: "Termino", label: "Fecha Término", type: "date" },
  { key: "PRIDE", label: "PRIDE" },
  { key: "Mail", label: "Mail" },
  { key: "Especialidad", label: "Especialidad" },
  { key: "Disciplina", label: "Disciplina" },
  {
    key: "Ultima modificacion a la base",
    label: "Última Modificación",
    type: "date",
  },
  { key: "Miembro anterior", label: "Miembro Anterior" },
];

function ComisionesDgapasContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [tabActual, setTabActual] = useState(
    tabParam || PESTANHAS_DGAPA[0].value,
  );
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  // Asistente Ejecutiva es solo consulta: no puede agregar, modificar ni eliminar registros de DGAPA
  const esSoloConsulta = rolUsuario === "ASISTENTE_EJECUTIVA";

  const { datos, cargando, agregarComision, editarComision, eliminarComision } =
    useCatalogo<ComisionDGAPA>(tabActual, "dgapaGeneral");

  const tabActualLabel = useMemo(
    () =>
      PESTANHAS_DGAPA.find((p) => p.value === tabActual)?.label || "Registro",
    [tabActual],
  );

  const datosConUrgenciaAutomatica = useMemo(
    () =>
      (datos as ComisionRow[]).map((item) => ({
        ...item,
        urgencia: calcularUrgenciaPorFechas(
          item.Termino as string | Date | undefined,
        ),
      })),
    [datos],
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabActual(newValue);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar rol={rolUsuario} />
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3, md: 4 } }}
      >
        <BannerInstitucional titulo="Comisiones DGAPA" />

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabActual}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {PESTANHAS_DGAPA.map((pestana) => (
              <Tab
                key={pestana.value}
                label={pestana.label}
                value={pestana.value}
              />
            ))}
          </Tabs>
        </Box>

        {cargando ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "#ee9105" }} />
          </Box>
        ) : (
          <GenericTable<ComisionRow>
            data={datosConUrgenciaAutomatica}
            rowKey="_id"
            displayField="Miembro"
            columns={columnasComisiones}
            title={`Detalles - ${tabActualLabel}`}
            readOnly={esSoloConsulta}
            onAdd={
              esSoloConsulta
                ? undefined
                : (newRow) => {
                    const { urgencia, ...datosLimpios } = newRow;
                    agregarComision(datosLimpios);
                  }
            }
            onEdit={
              esSoloConsulta
                ? undefined
                : (row) => {
                    if (row._id) {
                      const { urgencia, ...datosLimpios } = row;
                      editarComision(row._id, datosLimpios);
                    }
                  }
            }
            onDelete={
              esSoloConsulta
                ? undefined
                : (row) => row._id && eliminarComision(row._id)
            }
          />
        )}
      </Container>
    </Box>
  );
}

export default function ComisionesDgapasPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress sx={{ color: "#ee9105" }} />
        </Box>
      }
    >
      <ComisionesDgapasContent />
    </Suspense>
  );
}
