"use client";

import React, { useState, useEffect } from "react";
import { Container, Box, Typography, CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar";
import GenericTable, { ColumnConfig } from "../components/GenericTable";

interface MiembroSubcomision {
  _id?: string;
  idioma: string | null;
  nombre_y_cargo: string | null;
  adscripcion: string | null;
  periodo: string | null;
  coordinador: string | null;
  [key: string]: unknown;
}

const columnasSubcomisiones: ColumnConfig<MiembroSubcomision>[] = [
  { key: "idioma", label: "Idioma" },
  { key: "nombre_y_cargo", label: "Nombre y Cargo" },
  { key: "adscripcion", label: "Adscripción" },
  { key: "periodo", label: "Periodo" },
  { key: "coordinador", label: "Coordinador" },
];

const titleSx = {
  mb: 1,
  fontWeight: 700,
  fontStyle: "italic",
  fontFamily: "'Playfair Display', Georgia, serif",
  color: "#ee9105",
  textAlign: "center",
} as const;

export default function SubcomisionLenguasPage() {
  const [datos, setDatos] = useState<MiembroSubcomision[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  const base_api = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "";

  const API_URL = `${base_api}/api/v1/lenguas`;

  useEffect(() => {
    if (base_api) {
      console.log(
        `%c🗣️ API SUBCOMISIÓN LENGUAS CONECTADA: %c${API_URL}`,
        "color: #ee9105; font-weight: bold; font-size: 11px;",
        "color: #00b0ff; font-style: italic;",
      );
      obtenerMiembrosLenguas();
    } else {
      console.error(
        "🚨 La variable NEXT_PUBLIC_API_URL no está definida en Vercel.",
      );
      setCargando(false);
    }
  }, [API_URL, base_api]);

  const obtenerMiembrosLenguas = async () => {
    if (!base_api) return;
    try {
      const respuesta = await fetch(API_URL);
      const resultado = await respuesta.json();
      if (resultado.success) {
        setDatos(resultado.data);
      } else {
        console.error(
          "Error al cargar subcomisiones de lenguas:",
          resultado.error,
        );
      }
    } catch (error) {
      console.error("Error de red al cargar subcomisión de lenguas:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleAddLengua = async (newRow: Record<string, string>) => {
    if (!base_api) return;
    try {
      const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRow),
      });

      const resultado = await respuesta.json();

      if (resultado.success) {
        alert("Registro agregado a la subcomisión de lenguas con éxito.");
        obtenerMiembrosLenguas();
      } else {
        alert("Error del servidor: " + resultado.error);
      }
    } catch (error) {
      console.error("Error al agregar registro de lenguas:", error);
      alert("Hubo un error de red al intentar agregar el registro.");
    }
  };

  const handleEditLengua = async (updatedRow: MiembroSubcomision) => {
    if (!base_api) return;

    if (!updatedRow._id) {
      alert("No se puede editar este registro porque carece de un ID válido.");
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/${updatedRow._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRow),
      });

      const resultado = await respuesta.json();

      if (resultado.success) {
        alert("Cambios guardados con éxito en la subcomisión de lenguas.");
        obtenerMiembrosLenguas();
      } else {
        alert("Error al actualizar: " + resultado.error);
      }
    } catch (error) {
      console.error("Error al actualizar registro de lenguas:", error);
      alert("Hubo un error de red al intentar guardar los cambios.");
    }
  };

  const handleDeleteLengua = async (rowToDelete: MiembroSubcomision) => {
    if (!base_api) return;

    if (!rowToDelete._id) {
      alert(
        "No se puede eliminar el registro debido a la falta de un ID válido.",
      );
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/${rowToDelete._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const resultado = await respuesta.json();

      if (resultado.success) {
        alert("Registro eliminado de la subcomisión de lenguas con éxito.");
        obtenerMiembrosLenguas();
      } else {
        alert("Error al eliminar: " + resultado.error);
      }
    } catch (error) {
      console.error("Error al eliminar registro de lenguas:", error);
      alert("Hubo un error de red al intentar eliminar el registro.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={titleSx}>
          Subcomisiones Evaluadoras de Lenguas
        </Typography>

        {cargando ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress sx={{ color: "#ee9105" }} />
          </Box>
        ) : (
          <GenericTable<MiembroSubcomision>
            data={datos}
            rowKey="_id"
            displayField="Miembro"
            columns={columnasSubcomisiones}
            title="Ficha de la Subcomisión"
            addTitle="Añadir Miembro de Lenguas"
            editTitle="Modificar Ficha de Lenguas"
            onAdd={handleAddLengua}
            onEdit={handleEditLengua}
            onDelete={handleDeleteLengua}
          />
        )}
      </Container>
    </Box>
  );
}
