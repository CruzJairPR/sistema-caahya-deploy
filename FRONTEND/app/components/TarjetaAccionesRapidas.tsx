"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  Typography,
  Grid as Grid,
  Button,
  Box,
  Divider,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { saveToHistory } from "../utils/history";

interface Atajo {
  label: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

export default function TarjetaAccionesRapidas() {
  const router = useRouter();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    setRole(localStorage.getItem("userRole") || "");
  }, []);

  const handleAtajoClick = (
    label: string,
    path: string,
    extraAction?: () => void,
  ) => {
    saveToHistory(`Atajo rápido: ${label}`, path);
    if (extraAction) extraAction();
    router.push(path);
  };

  const obtenerAtajosPorRol = (): Atajo[] => {
    switch (role) {
      case "SECRETARIA_CONSEJO":
        return [
          {
            label: "Dar de Alta Miembro",
            icon: <PersonAddIcon />,
            color: "#003DA5",
            action: () =>
              handleAtajoClick("Alta Miembro", "/miembros?action=nuevo"),
          },
          {
            label: "Descargar Plantilla de Acta",
            icon: <PictureAsPdfIcon />,
            color: "#2e7d32",
            action: () => alert("Descargando Plantilla_Acta_2026.docx ..."),
          },
          {
            label: "Ver Próximos Vencimientos",
            icon: <AssignmentIcon />,
            color: "#d32f2f",
            action: () =>
              handleAtajoClick(
                "Ver Vencimientos",
                "/miembros?filter=vencimientos",
              ),
          },
        ];

      case "SECRETARIA_AUXILIAR_1":
        return [
          {
            label: "Subir Nuevo Dictamen",
            icon: <UploadFileIcon />,
            color: "#003DA5",
            action: () =>
              handleAtajoClick("Subir Dictamen", "/dictamenes?action=subir"),
          },
          {
            label: "Firmas Pendientes",
            icon: <HistoryEduIcon />,
            color: "#ed6c02",
            action: () =>
              handleAtajoClick(
                "Firmas Pendientes",
                "/dictamenes?status=pendiente-firma",
              ),
          },
        ];

      case "SECRETARIA_AUXILIAR_2":
        return [
          {
            label: "Calendario de Sesiones",
            icon: <AssignmentIcon />,
            color: "#003DA5",
            action: () =>
              handleAtajoClick(
                "Calendario Sesiones",
                "/comisiones?tab=calendario",
              ),
          },
        ];

      case "ASISTENTE_EJECUTIVA":
        return [
          {
            label: "Redactar Oficio Nuevo",
            icon: <UploadFileIcon />,
            color: "#003DA5",
            action: () =>
              handleAtajoClick("Nuevo Oficio", "/oficios?action=redactar"),
          },
        ];

      case "COORDINADORA":
        return [
          {
            label: "Panel de Auditoría (Historial)",
            icon: <AdminPanelSettingsIcon />,
            color: "#9c27b0",
            action: () => handleAtajoClick("Auditoría General", "/historial"),
          },
          {
            label: "Exportar Reporte Global",
            icon: <PictureAsPdfIcon />,
            color: "#2e7d32",
            action: () =>
              alert("Generando PDF Ejecutivo del estado del Consejo..."),
          },
          {
            label: "Revisión de Alertas Críticas",
            icon: <BoltIcon />,
            color: "#d32f2f",
            action: () =>
              handleAtajoClick("Alertas Críticas", "/dashboard?focus=alertas"),
          },
        ];

      default:
        return [];
    }
  };

  const atajosActivos = obtenerAtajosPorRol();

  if (atajosActivos.length === 0) return null;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <BoltIcon sx={{ color: "#ee9105", fontSize: { xs: 32, sm: 38 } }} />
        <Typography
          variant="h5"
          component="h2"
          sx={{
            color: "#003DA5",
            fontWeight: 700,
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        >
          Acciones Rápidas
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {atajosActivos.map((atajo, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={atajo.icon}
              onClick={atajo.action}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                py: 1.5,
                px: 2,
                borderRadius: 2,
                color: atajo.color,
                borderColor: `${atajo.color}40`,
                "&:hover": {
                  bgcolor: `${atajo.color}08`,
                  borderColor: atajo.color,
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
                },
              }}
            >
              {atajo.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
