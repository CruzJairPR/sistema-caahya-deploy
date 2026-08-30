"use client";

import {
  Container,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import AdminTable from "../../components/AdminTable";
import { ColumnConfig } from "../../components/GenericTable";
import { usePlanesTable } from "../../hooks/usePlanesTable";
import { PlanEstudio } from "../../types/planes";
import BannerInstitucional from "../../components/BannerInstitucional";

const columnasPlanes: ColumnConfig<PlanEstudio>[] = [
  { key: "licenciatura", label: "Licenciatura" },
  { key: "entidad", label: "Entidad / Facultad" },
  { key: "creacion_implantacion", label: "Año Creación" },
  { key: "modificacion", label: "Modificación", type: "date" },
  { key: "evaluacion", label: "Evaluación" },
  { key: "adecuacion_temas_emergentes", label: "Temas Emergentes" },
  { key: "adecuacion_titulacion", label: "Titulación" },
];

export default function PlanesEstudioPage() {
  const {
    datos,
    cargando,
    error,
    notificacion,
    cerrarNotificacion,
    handleAdd,
    handleEdit,
    handleDelete,
  } = usePlanesTable();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar />

      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <BannerInstitucional titulo="Escolarizado" />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {cargando ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress sx={{ color: "#ee9105" }} />
          </Box>
        ) : (
          <AdminTable<PlanEstudio>
            data={datos}
            columns={columnasPlanes}
            rowKey="_id"
            displayField="licenciatura"
            title="Catálogo de Licenciaturas"
            addTitle="Registrar Nueva Licenciatura"
            editTitle="Modificar Detalles del Plan de Estudio"
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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
          sx={{ width: "100%" }}
        >
          {notificacion?.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}
