"use client";

import {
  Container,
  Box,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import AdminTable from "../../components/AdminTable";
import { ColumnConfig } from "../../components/GenericTable";
import { Miembro } from "../../types/miembros";
import { useMiembros } from "../../hooks/useMiembros";
import BannerInstitucional from "../../components/BannerInstitucional";

const columnasMiembros: ColumnConfig<Miembro>[] = [
  { key: "nombre", label: "Nombre" },
  { key: "entidad", label: "Entidad" },
  { key: "telefono1", label: "Teléfono 1" },
  { key: "telefono2", label: "Teléfono 2" },
  { key: "correo1", label: "Correo 1" },
  { key: "correo2", label: "Correo 2" },
  { key: "comentarios", label: "Observaciones" },
];

export default function MiembrosDirectorioPage() {
  const {
    datos,
    cargando,
    error,
    notificacion,
    cerrarNotificacion,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useMiembros();

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
        <BannerInstitucional titulo="Miembros CAAHYA" />

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
          <AdminTable<Miembro>
            data={datos}
            columns={columnasMiembros}
            rowKey="_id"
            displayField="nombre"
            title="Ficha del Miembro"
            addTitle="Añadir Nuevo Miembro"
            editTitle="Modificar Ficha del Miembro"
            onAdd={handleAdd}
            onEdit={(updatedRow) => handleEdit(updatedRow)}
            onDelete={(row) => handleDelete(row._id!)}
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
