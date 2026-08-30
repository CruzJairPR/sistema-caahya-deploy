"use client";

import { useState, useEffect } from "react";
import { Container, Box, CircularProgress, Alert } from "@mui/material";
import Navbar from "../../components/Navbar";
import GenericTable, { ColumnConfig } from "../../components/GenericTable";
import type { EntidadDirectorio } from "../../types/entidad";
import { useEntidades } from "../../hooks/useEntidades";
import BannerInstitucional from "../../components/BannerInstitucional";

const columnasdirectorio: ColumnConfig<EntidadDirectorio>[] = [
  { key: "entidad", label: "Entidad Universitaria" },
  { key: "director.nombre", label: "Director(a)" },
  { key: "director.correo", label: "Correo Director" },
  { key: "director.telefono", label: "Tel. Director" },
  { key: "secretario.nombre", label: "Secretario(a)" },
  { key: "secretario.correo", label: "Correo Secretario" },
  { key: "secretario.telefono", label: "Tel. Secretario" },
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

export default function EntidadesPage() {
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  // Asistente Ejecutiva es solo consulta: no puede añadir, modificar ni eliminar entidades
  const esSoloConsulta = rolUsuario === "ASISTENTE_EJECUTIVA";

  const {
    datos,
    cargando,
    error,
    agregarEntidad,
    editarEntidad,
    eliminarEntidad,
  } = useEntidades();

  const handleAdd = (nuevaEntidad: any) => {
    if (esSoloConsulta) return;
    agregarEntidad(nuevaEntidad as EntidadDirectorio);
  };

  const handleEdit = (updatedRow: any) => {
    if (esSoloConsulta) return;
    const row = updatedRow as EntidadDirectorio;
    if (row._id) {
      editarEntidad(row._id, row);
    }
  };

  const handleDelete = (row: any) => {
    if (esSoloConsulta) return;
    const entidad = row as EntidadDirectorio;
    if (entidad._id) {
      eliminarEntidad(entidad._id);
    }
  };

  return (
    <Box sx={containerBgSx}>
      <Navbar rol={rolUsuario} />
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <BannerInstitucional titulo="Directorio de Entidades" />

        {cargando ? (
          <Box sx={loaderContainerSx}>
            <CircularProgress sx={progressSx} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Box sx={tableWrapperSx}>
            <GenericTable<EntidadDirectorio>
              data={datos}
              rowKey="_id"
              columns={columnasdirectorio}
              displayField="entidad"
              title="Ficha de la Entidad"
              addTitle="Añadir Nueva Entidad"
              editTitle="Modificar Ficha de la Entidad"
              readOnly={esSoloConsulta}
              onAdd={esSoloConsulta ? undefined : handleAdd}
              onEdit={esSoloConsulta ? undefined : handleEdit}
              onDelete={esSoloConsulta ? undefined : handleDelete}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
