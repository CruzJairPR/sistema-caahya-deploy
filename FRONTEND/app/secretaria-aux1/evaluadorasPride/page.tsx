"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import AdminTable from "../../components/AdminTable";
import { ColumnConfig } from "../../components/GenericTable";
import BannerInstitucional from "../../components/BannerInstitucional";
import {
  useEvaluadorasPride,
  EvaluadoraPride,
} from "../../hooks/useEvaluadorasPride";
import { calcularUrgenciaPorFechas } from "../../utils/alertasFechas";
import { useNotifications } from "../../hooks/useNotifications";

type EvaluadoraRow = EvaluadoraPride & {
  urgencia?: string;
  miembroPropuesto?: string;
  institucionVencida?: string;
};

// Columnas para la pestaña principal (Activas)
const columnasEvaluadorasActivas: ColumnConfig<EvaluadoraRow>[] = [
  { key: "urgencia", label: "Urgencia", hidden: true },
  { key: "entidad", label: "Entidad" },
  { key: "fuenteDeDesignacion", label: "Fuente de Designación" },
  { key: "tipoDeMiembro", label: "Tipo de Miembro" },
  { key: "miembro", label: "Miembro" },
  { key: "adscripcion", label: "Adscripción" },
  { key: "categoriaYNivel", label: "Categoría y Nivel" },
  { key: "periodo", label: "Periodo" },
  { key: "inicio", label: "Inicio", type: "date" },
  { key: "termino", label: "Término", type: "date" },
  { key: "permanencia", label: "Permanencia" },
  { key: "observaciones", label: "Observaciones" },
  { key: "preferenciasDeAreasCAAHyA", label: "Preferencias CAAHyA" },
  { key: "ultimaModificacion", label: "Última Modificación", type: "date" },
  { key: "miembroAnterior", label: "Miembro Anterior" },
];

// Columnas específicas para la pestaña de Vencidas (Historial)
const columnasEvaluadorasVencidas: ColumnConfig<EvaluadoraRow>[] = [
  { key: "entidad", label: "Entidad" },
  { key: "fuenteDeDesignacion", label: "SNII / Estímulo PRIDE" },
  { key: "tipoDeMiembro", label: "Tipo de Miembro" },
  { key: "miembro", label: "Miembro" },
  { key: "adscripcion", label: "Adscripción" },
  { key: "periodo", label: "Periodo" },
  { key: "termino", label: "Término", type: "date" },
  { key: "miembroAnterior", label: "Miembro propuesto" },
  { key: "institucionVencida", label: "Institución" },
];

export default function EvaluadorasPridePage() {
  const { datos, cargando, error, handleAdd, handleEdit, handleDelete } =
    useEvaluadorasPride();

  const [tabActual, setTabActual] = useState<string>("activas");
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabActual(newValue);
  };

  useNotifications(rolUsuario);

  // useGlobalAlertasSecretaria1 (montado en el layout/nivel superior) ya
  // registra la alerta agrupada (id 9001) para PRIDE. Este componente
  // solo necesita calcular `urgencia` para pintar el semáforo de la tabla
  // y filtrar la pestaña de "Vencidas".
  const datosConUrgenciaAutomatica = useMemo(
    () =>
      (datos as EvaluadoraRow[]).map((item) => ({
        ...item,
        urgencia: calcularUrgenciaPorFechas(
          item.termino as string | Date | undefined,
        ),
      })),
    [datos],
  );

  const columnasActuales =
    tabActual === "vencidas"
      ? columnasEvaluadorasVencidas
      : columnasEvaluadorasActivas;

  const datosFiltrados = datosConUrgenciaAutomatica.filter((item) => {
    if (tabActual === "vencidas") {
      return item.urgencia === "vencido" || item.urgencia === "critico";
    }
    return true;
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar rol={rolUsuario} />

      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <BannerInstitucional titulo="Comision Evaluadora PRIDE" />

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabActual}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": { fontWeight: "bold" },
              "& .Mui-selected": { color: "#ee9105 !important" },
              "& .MuiTabs-indicator": { backgroundColor: "#ee9105" },
            }}
          >
            <Tab label="Comision Evaluadora PRIDE" value="activas" />
            <Tab
              label="Comisiones Evaluadoras PRIDE Vencidas"
              value="vencidas"
            />
          </Tabs>
        </Box>

        {cargando ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress sx={{ color: "#ee9105" }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <AdminTable<EvaluadoraRow>
            data={datosFiltrados}
            rowKey="_id"
            displayField="miembro"
            columns={columnasActuales}
            title={
              tabActual === "vencidas"
                ? "Ficha de Evaluadoras PRIDE Vencidas (Historial)"
                : "Ficha de Evaluadora PRIDE"
            }
            addTitle="Añadir Nueva Evaluadora"
            editTitle="Modificar Evaluadora PRIDE"
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Container>
    </Box>
  );
}
