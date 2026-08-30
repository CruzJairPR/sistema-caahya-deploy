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
import { useSuayedTable } from "../../hooks/useSuayedTable";
import { PlanEstudioSuayed } from "../../types/suayed";
import BannerInstitucional from "../../components/BannerInstitucional";

const columnasSuayed: ColumnConfig<PlanEstudioSuayed>[] = [
  { key: "licenciatura", label: "Licenciatura" },
  { key: "entidad", label: "Entidad Académica" },
  { key: "creacion_implantacion", label: "Creación / Implantación" },
  { key: "modificacion", label: "Modificación" },
  { key: "evaluacion", label: "Evaluación" },
  { key: "adecuacion_temas_emergentes", label: "Temas Emergentes" },
  { key: "adecuacion_titulacion", label: "Titulación" },
];

export default function PlanEstudioSuayedPage() {
  const {
    datos,
    cargando,
    error,
    notificacion,
    cerrarNotificacion,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useSuayedTable();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3 },
          flexGrow: 1,
        }}
      >
        <BannerInstitucional
          titulo="          SUAyED
"
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {cargando ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: { xs: 4, md: 8 },
            }}
          >
            <CircularProgress sx={{ color: "#ee9105" }} />
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <AdminTable<PlanEstudioSuayed>
              data={datos}
              columns={columnasSuayed}
              rowKey="_id"
              displayField="licenciatura"
              title="Catálogo de Licenciaturas"
              addTitle="Registrar Nueva Licenciatura"
              editTitle="Modificar Detalles del Plan de Estudio"
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Box>
        )}
      </Container>

      <Snackbar
        open={notificacion !== null}
        autoHideDuration={4000}
        onClose={cerrarNotificacion}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ mb: { xs: 2, sm: 0 } }}
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
