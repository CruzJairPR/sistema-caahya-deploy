"use client";

import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import Navbar from "../components/Navbar";
import GenericTable, { ColumnConfig } from "../components/GenericTable";
import { ComisionPermanenteReg } from "../types/comisionPermanente";
import { useComisionPermanente } from "../hooks/useComisionPermanente";

const columnasPermanente: ColumnConfig<ComisionPermanenteReg>[] = [
  { key: "Entidad", label: "Entidad" },
  { key: "Comisión", label: "Comisión" },
  { key: "Fuente de Designación", label: "Fuente de Designación" },
  { key: "Miembro", label: "Miembro" },
  { key: "Adscripción", label: "Adscripción" },
  { key: "Periodo", label: "Período" },
];

export default function ComisionPermanentePage() {
  const {
    datos,
    cargando,
    error,
    notificacion,
    cerrarNotificacion,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useComisionPermanente();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 1,
            fontWeight: 700,
            fontStyle: "italic",
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#ee9105",
            textAlign: "center",
          }}
        >
          Comisión Permanente
        </Typography>

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
          <GenericTable<ComisionPermanenteReg>
            data={datos}
            columns={columnasPermanente}
            rowKey="_id"
            displayField="Miembro"
            title="Ficha de la Comisión Permanente"
            addTitle="Añadir Nueva Comisión"
            editTitle="Modificar Ficha de la Comisión"
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
