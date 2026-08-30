"use client";
import { Container, Box, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import GenericTable, { ColumnConfig } from "../components/GenericTable";

interface Director {
  nombre: string;
  correo: string;
}

interface EntidadDirectorio {
  entidad: string;
  director: Director;
  [key: string]: unknown;
}

const columnasDirectorio: ColumnConfig<EntidadDirectorio>[] = [
  { key: "entidad", label: "Entidad Universitaria" },
  { key: "director.nombre", label: "Director(a)" },
  { key: "director.correo", label: "Correo" },
];

export default function comisionesValuadoras() {
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
          Comisiones Valuadoras
        </Typography>
      </Container>
    </Box>
  );
}
