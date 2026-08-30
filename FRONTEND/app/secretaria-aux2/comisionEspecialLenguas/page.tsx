"use client";

import { useState } from "react";
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import AdminTable from "../../components/AdminTable";
import BannerInstitucional from "../../components/BannerInstitucional";

import { ColumnConfig } from "../../components/GenericTable";
import { useSubcomisionLenguas } from "../../hooks/useSubcomisionLenguas";

export type NivelUrgencia = "vencido" | "critico" | "advertencia" | "normal";

export const calcularUrgenciaPorFechas = (
  fechaTerminoStr?: string | Date,
): NivelUrgencia => {
  if (!fechaTerminoStr) return "normal";

  const hoy = new Date();
  const termino = new Date(fechaTerminoStr);

  if (isNaN(termino.getTime())) return "normal";

  const diffTime = termino.getTime() - hoy.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = diffDays / 30;

  if (diffDays < 0) return "vencido";
  if (diffMonths <= 3) return "critico";
  if (diffMonths <= 6) return "advertencia";

  return "normal";
};

const columnasGenerales: ColumnConfig<any>[] = [
  { key: "idioma", label: "IDIOMA", required: true },
  { key: "integrante", label: "INTEGRANTES", required: true },
  { key: "cargo", label: "CARGO" },
  { key: "adscripcion", label: "ADSCRIPCIÓN" },
  {
    key: "periodo_integrante.fecha_inicio",
    label: "FECHA INICIO",
    type: "date",
  },
  { key: "periodo_integrante.fecha_final", label: "FECHA FINAL", type: "date" },
  { key: "periodo_integrante.periodo", label: "PERÍODO" },
];

const columnasCoordinadores: ColumnConfig<any>[] = [
  { key: "idioma", label: "IDIOMA", required: true },
  { key: "integrante", label: "INTEGRANTE", required: true },
  { key: "coordinacion.periodo", label: "PERÍODO COORD." },
  { key: "coordinacion.fecha_inicio", label: "INICIO COORD.", type: "date" },
  { key: "coordinacion.fecha_final", label: "FIN COORD.", type: "date" },
];

export default function ComisionEspecialLenguasPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const {
    datos,
    cargando,
    error,
    notificacion,
    cerrarNotificacion,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useSubcomisionLenguas();

  // LIMPIEZA DE ID PARA EVITAR EL 404 AL EDITAR
  const handleCustomEdit = async (filaEditada: any) => {
    const payloadLimpio = {
      ...filaEditada,
      _id:
        typeof filaEditada._id === "object"
          ? filaEditada._id.toString()
          : filaEditada._id,
    };
    await handleEdit(payloadLimpio);
  };

  const handleAddCoordinador = async (nuevaFila: any) => {
    const payload = {
      ...nuevaFila,
      coordinacion: {
        ...(nuevaFila.coordinacion || {}),
        es_coordinador: true, 
      },
    };
    await handleAdd(payload);
  };

  const datosProcesados = (datos || []).map((item: any) => {
    const fFinalInt = item.periodo_integrante?.fecha_final;
    return {
      ...item,
      _id: typeof item._id === "object" ? item._id.toString() : item._id,
      integrante: item.integrante || "—",
      cargo: item.cargo || "—",
      adscripcion: item.adscripcion || "—",
      urgencia: calcularUrgenciaPorFechas(fFinalInt),
    };
  });

  const datosCoordinadores = datosProcesados.filter(
    (item: any) =>
      item.coordinacion?.es_coordinador === true ||
      item.coordinacion?.es_coordinador === "true",
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
        <Navbar />
        <Container
          maxWidth="xl"
          sx={{
            py: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <BannerInstitucional titulo="Comisión Especial de Lenguas" />

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={tabIndex}
              onChange={(e, nuevoValor) => setTabIndex(nuevoValor)}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Todos los Miembros" />
              <Tab label={`Coordinadores (${datosCoordinadores.length})`} />
            </Tabs>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {cargando ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
              <CircularProgress sx={{ color: "#ee9105" }} />
            </Box>
          ) : (
            <>
              {tabIndex === 0 && (
                <AdminTable<any>
                  data={datosProcesados}
                  columns={columnasGenerales}
                  rowKey="_id"
                  displayField="integrante"
                  title="Ficha del Miembro"
                  addTitle="Agregar Nuevo Miembro"
                  editTitle="Editar Miembro"
                  onAdd={handleAdd}
                  onEdit={handleCustomEdit}
                  onDelete={handleDelete}
                />
              )}

              {tabIndex === 1 && (
                <AdminTable<any>
                  data={datosCoordinadores}
                  columns={columnasCoordinadores}
                  rowKey="_id"
                  displayField="integrante"
                  title="Coordinación"
                  addTitle="Agregar Coordinador"
                  editTitle="Editar Coordinador"
                  onAdd={handleAddCoordinador}
                  onEdit={handleCustomEdit}
                  onDelete={handleDelete}
                />
              )}
            </>
          )}
        </Container>

        <Snackbar
          open={notificacion !== null}
          autoHideDuration={4000}
          onClose={cerrarNotificacion}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={cerrarNotificacion}
            severity={notificacion?.tipo ?? "info"}
            variant="filled"
            sx={{ width: "100%", borderRadius: 2 }}
          >
            {notificacion?.mensaje}
          </Alert>
        </Snackbar>
    </Box>
  );
}
