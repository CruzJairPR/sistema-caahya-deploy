"use client";

import { Container, Box, Typography, CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar";
import GenericTable, { ColumnConfig } from "../components/GenericTable";
import { useCoel } from "../hooks/useCoel";
import { MiembroCoel } from "../services/coelService";

const columnasCoel: ColumnConfig<MiembroCoel>[] = [
  { key: "categoria", label: "Categoría" },
  { key: "nombre_y_cargo", label: "Nombre y Cargo" },
  { key: "adscripcion", label: "Adscripción" },
  { key: "periodo", label: "Periodo" },
];

const containerBgSx = {
  minHeight: "100vh",
  bgcolor: "#f5f5f5",
} as const;

const loaderContainerSx = {
  display: "flex",
  justifyContent: "center",
  mt: 8,
} as const;

const progressSx = {
  color: "#ee9105",
} as const;

const titleSx = {
  mt: { xs: 2, sm: 3, md: 4 },
  mb: { xs: 3, sm: 4 },
  fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
  fontWeight: 700,
  fontStyle: "italic",
  fontFamily: "'Playfair Display', Georgia, serif",
  color: "#ee9105",
  textAlign: "center",
} as const;

const tableWrapperSx = {
  width: "100%",
  overflowX: "auto",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: { xs: "none", sm: "0px 2px 4px rgba(0,0,0,0.05)" },
  p: { xs: 1, sm: 2 },
} as const;

export default function ComisionCoelPage() {
  const { datos, cargando, agregarMiembro, editarMiembro, eliminarMiembro } =
    useCoel();

  return (
    <Box sx={containerBgSx}>
      <Navbar />
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, sm: 4 },
          px: { xs: 1.5, sm: 3 },
        }}
      >
        <Typography variant="h4" component="h1" sx={titleSx}>
          Comisión COEL
        </Typography>

        {cargando ? (
          <Box sx={loaderContainerSx}>
            <CircularProgress sx={progressSx} />
          </Box>
        ) : (
          <Box sx={tableWrapperSx}>
            <GenericTable<MiembroCoel>
              data={datos}
              columns={columnasCoel}
              rowKey="name_and_title"
              displayField="nombre_y_cargo"
              title="Ficha del Miembro COEL"
              addTitle="Añadir Miembro COEL"
              editTitle="Modificar Ficha COEL"
              onAdd={agregarMiembro}
              onEdit={editarMiembro}
              onDelete={eliminarMiembro}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
