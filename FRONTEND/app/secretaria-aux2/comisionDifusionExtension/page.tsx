"use client";

import {
  Container,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Navbar from "../../components/Navbar";

import AdminTable from "../../components/AdminTable";
import { ColumnConfig } from "../../components/GenericTable";
import { useDifusion } from "../../hooks/useDifusion";
import { MiembroDifusion } from "../../services/difusionService";
import BannerInstitucional from "../../components/BannerInstitucional";

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

  if (diffDays < 0) {
    return "vencido";
  }

  // 3 meses o menos (~90 días) -> Rojo (crítico)
  if (diffMonths <= 3) {
    return "critico";
  }

  // 6 meses o menos (~180 días) -> Amarillo (advertencia)
  if (diffMonths <= 6) {
    return "advertencia";
  }

  return "normal";
};

const columnasDifusion: ColumnConfig<any>[] = [
  { key: "Nombre", label: "Nombre" },
  { key: "Cargo", label: "Cargo" },
  { key: "Adscripción", label: "Adscripción" },
  { key: "Correo", label: "Correo" },
  { key: "correo2", label: "Correo secundario" },
  { key: "Teléfono", label: "Teléfono" },
  { key: "Telefono2", label: "Teléfono secundario" },
  {
    key: "fechaInicio",
    label: "Fecha Inicio",
    type: "date",
  },
  {
    key: "fechaFin",
    label: "Fecha Final",
    type: "date",
  },
  { key: "Observaciones", label: "Observaciones" },
];

const containerBgSx = { minHeight: "100vh", bgcolor: "#f5f5f5" } as const;

const loaderContainerSx = {
  display: "flex",
  justifyContent: "center",
  mt: 8,
} as const;

const progressSx = { color: "#ee9105" } as const;

const tableWrapperSx = {
  width: "100%",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: { xs: "none", sm: "0px 2px 4px rgba(0,0,0,0.05)" },
} as const;

export default function ComisionDifusionExtensionPage() {
  const {
    datos,
    cargando,
    notificacion,
    agregarMiembro,
    editarMiembro,
    eliminarMiembro,
    cerrarNotificacion,
  } = useDifusion();

  // Procesamos los datos para inyectar la urgencia calculada basándonos en fechaFin
  const datosConUrgencia = datos.map((item: any) => ({
    ...item,
    urgencia: calcularUrgenciaPorFechas(
      item.fechaFin as string | Date | undefined,
    ),
  }));

  return (
    <Box sx={containerBgSx}>
      <Navbar />
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <BannerInstitucional titulo="Comisión de Difusión y Extensión" />

        {cargando ? (
          <Box sx={loaderContainerSx}>
            <CircularProgress sx={progressSx} />
          </Box>
        ) : (
          <Box sx={tableWrapperSx}>
            <AdminTable<any>
              data={datosConUrgencia}
              columns={columnasDifusion}
              title="Ficha del Miembro"
              addTitle="Añadir Miembro de Difusión"
              editTitle="Modificar Ficha de Difusión"
              rowKey="_id"
              displayField="Nombre"
              onAdd={agregarMiembro}
              onEdit={editarMiembro}
              onDelete={eliminarMiembro}
            />
          </Box>
        )}
      </Container>

      <Snackbar
        open={Boolean(notificacion?.open)}
        autoHideDuration={4000}
        onClose={cerrarNotificacion}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={cerrarNotificacion}
          severity={notificacion?.severity ?? "info"}
          variant="filled"
          sx={{ width: "100%", boxShadow: 3 }}
        >
          {notificacion?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
