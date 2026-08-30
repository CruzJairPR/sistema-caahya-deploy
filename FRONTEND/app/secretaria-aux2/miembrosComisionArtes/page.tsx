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
import { MiembroComisionArtes } from "../../types/comisionArtes";
import { useComisionArtes } from "../../hooks/useComisionArtes";
import BannerInstitucional from "../../components/BannerInstitucional";

const columnasMiembrosComisionArtes: ColumnConfig<MiembroComisionArtes>[] = [
  { key: "rol", label: "Rol / Representación o Entidad" },
  { key: "nombre", label: "Nombre Completo" },
  { key: "correo", label: "Correo Electrónico" },
  { key: "correo2", label: "Correo secundario" },
  { key: "telefono", label: "Telefono" },
  { key: "telefono2", label: " Telefono secundario" },
  { key: "comentarios", label: "Comentarios" },
];

export default function MiembrosComisionArtesPage() {
  const {
    datos,
    cargando,
    error,
    notificacion,
    cerrarNotificacion,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useComisionArtes();

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
        <BannerInstitucional titulo="Comisión Especial de Artes" />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {cargando ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress sx={{ color: "#00b0ff" }} />
          </Box>
        ) : (
          <AdminTable<MiembroComisionArtes>
            data={datos}
            columns={columnasMiembrosComisionArtes}
            rowKey="_id"
            displayField="nombre"
            title="Miembros de la Comisión de artes"
            addTitle="Registrar Nuevo Integrante"
            editTitle="Modificar Datos del Integrante"
            onAdd={handleAdd}
            onEdit={(updatedRow) => handleEdit(updatedRow)}
            onDelete={handleDelete}
          />
        )}
      </Container>

      {notificacion && (
        <Snackbar
          open={true}
          autoHideDuration={4000}
          onClose={cerrarNotificacion}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={cerrarNotificacion}
            severity={notificacion.tipo}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {notificacion.mensaje}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
