"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Link,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Search as SearchIcon,
  HistoryToggleOff as HistoryIcon,
  School as SchoolIcon,
  LibraryBooks as BookIcon,
  AdminPanelSettings as AdminIcon,
  OpenInNew as OpenIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

const AnimatedPaper = motion.create(Paper);
const AnimatedIcon = motion.create(SchoolIcon);

const mensajesBanner = [
  {
    titulo: "Consultas Académicas",
    descripcion:
      "Módulo de visualización y acceso a la información del sistema escolar de los Consejos Académicos de Área.",
  },
  {
    titulo: "Área de Humanidades y Artes",
    descripcion:
      "Seguimiento oportuno de planes de estudio, comisiones especiales e historiales académicos vigentes.",
  },
  {
    titulo: "Información en Tiempo Real",
    descripcion:
      "Sincronización directa con los nodos maestros para garantizar la integridad y seguridad de cada registro.",
  },
  {
    titulo: "Gestión de Comisiones",
    descripcion:
      "Acceso rápido a la administración y consulta de miembros de la Comisión Especial de Lenguas y comités dictaminadores.",
  },
  {
    titulo: "Historial Documental",
    descripcion:
      "Consulte de forma segura los dictámenes, acuerdos institucionales y el archivo histórico de las sesiones.",
  },
  {
    titulo: "Búsqueda Avanzada",
    descripcion:
      "Utilice el motor global indexado para localizar planes, opciones de titulación y asignaturas por identificador único.",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceActual((prevIndice) => (prevIndice + 1) % mensajesBanner.length);
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  const unamColors = {
    primary: "#1976d2",
    secondary: "#ee9105",
    dark: "#003DA5",
    bgCard: "#ffffff",
    borderColor: "#e0e0e0",
  };

  return (
    <Box
      sx={{
        bgcolor: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <Container
        maxWidth="lg"
        sx={{ mt: { xs: 3, sm: 5 }, pb: 6, flexGrow: 1, px: { xs: 2, sm: 3 } }}
      >
        <AnimatedPaper
          elevation={0}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          sx={{
            p: { xs: 4, sm: 5 },
            mb: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, #001a4d, ${unamColors.dark}, #002b80, #001f5c)`,
            backgroundSize: "400% 400%",
            animation: "gradientFlow 14s ease infinite",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0px 14px 40px rgba(0, 61, 165, 0.12)",
            "@keyframes gradientFlow": {
              "0%": { backgroundPosition: "0% 50%" },
              "50%": { backgroundPosition: "100% 50%" },
              "100%": { backgroundPosition: "0% 50%" },
            },
          }}
        >
          <AnimatedIcon
            animate={{
              rotate: [-10, -6, -14, -10],
              scale: [1, 1.06, 0.96, 1],
              opacity: [0.05, 0.08, 0.04, 0.05],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            sx={{
              position: "absolute",
              right: -10,
              bottom: -20,
              fontSize: 180,
            }}
          />

          <Box sx={{ minHeight: { xs: "120px", sm: "85px" } }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={indiceActual}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: { xs: "1.8rem", sm: "2.4rem" },
                    mb: 1,
                    letterSpacing: "-0.2px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {mensajesBanner[indiceActual].titulo}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.85,
                    fontWeight: 300,
                    maxWidth: "650px",
                    lineHeight: 1.5,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {mensajesBanner[indiceActual].descripcion}
                </Typography>
              </motion.div>
            </AnimatePresence>
          </Box>
        </AnimatedPaper>

        <Grid container spacing={4}>
          {/* Columna Izquierda */}
          <Grid size={{ xs: 12, md: 7 }} sx={{ display: "flex" }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                border: `1px solid ${unamColors.borderColor}`,
                bgcolor: unamColors.bgCard,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#cbd5e1",
                  boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.02)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2.5,
                }}
              >
                <BookIcon sx={{ color: unamColors.dark }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#1e293b" }}
                >
                  Acerca del Módulo
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3.5,
                  flexGrow: 1,
                  justifyContent: "center",
                }}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  <SearchIcon
                    sx={{ color: unamColors.secondary, fontSize: 22, mt: 0.2 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6, fontSize: "0.95rem" }}
                  >
                    Puedes hacer búsquedas avanzadas configuradas por
                    identificador, planes de estudio vigentes e historiales de
                    registros.
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <HistoryIcon
                    sx={{ color: unamColors.secondary, fontSize: 22, mt: 0.2 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6, fontSize: "0.95rem" }}
                  >
                    Consultar historial y documentos internos para el
                    seguimiento y control de las consultas generadas.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Columna Derecha */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: "flex" }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                border: `1px solid ${unamColors.borderColor}`,
                width: "100%",
                bgcolor: unamColors.bgCard,
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#cbd5e1",
                  boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.02)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2.5,
                }}
              >
                <AdminIcon sx={{ color: unamColors.dark }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#1e293b" }}
                >
                  Informacion de Red
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 900,
                      color: unamColors.dark,
                      letterSpacing: 1,
                    }}
                  >
                    UNAM
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      mt: 0.5,
                      mb: 3,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                    }}
                  >
                    HUMANIDADES Y ARTES
                  </Typography>
                </Box>

                <Box
                  sx={{
                    bgcolor: "#f0fdf4",
                    p: 2.5,
                    borderRadius: 3,
                    border: `1px dashed #bbf7d0`,
                    textAlign: "left",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#16a34a",
                        display: "inline-block",
                        animation: "pulseLive 2s infinite ease-in-out",
                        "@keyframes pulseLive": {
                          "0%": { transform: "scale(0.9)", opacity: 0.6 },
                          "50%": { transform: "scale(1.3)", opacity: 1 },
                          "100%": { transform: "scale(0.9)", opacity: 0.6 },
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#16a34a",
                        fontWeight: 700,
                        letterSpacing: 0.5,
                      }}
                    >
                      ESTADO DEL SISTEMA
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ color: "#475569", lineHeight: 1.5 }}
                  >
                    Conexión segura establecida. Las consultas se realizan en
                    tiempo real sobre el ciclo vigente.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 5,
            display: "flex",
            justifyContent: "center",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          {[
            {
              text: "Sitio Institucional",
              href: "https://www.caahya.unam.mx/",
            },
            {
              text: "Aviso de Privacidad",
              href: "https://www.caahya.unam.mx/?page_id=2151",
            },
            {
              text: "Soporte Técnico",
              href: "mailto:humanidadesyartes@unam.mx",
            },
          ].map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              underline="hover"
              sx={{
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: "0.85rem",
                "&:hover .m-icon": { transform: "translate(2px, -2px)" },
              }}
            >
              {link.text}
              <OpenIcon
                className="m-icon"
                sx={{ fontSize: 14, transition: "transform 0.2s ease-in-out" }}
              />
            </Link>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
