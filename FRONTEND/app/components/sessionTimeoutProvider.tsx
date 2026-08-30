"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

const TIEMPO_LIMITE_SESION = 30 * 60 * 1000;
const INTERVALO_REVISION = 5000;

export default function SessionTimeoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const cerrarSesionInmediato = () => {
    localStorage.clear();
    setOpenModal(false);
    window.location.href = "/";
  };

  const extenderSesion = () => {
    localStorage.setItem("loginTimestamp", Date.now().toString());
    setOpenModal(false);
  };

  useEffect(() => {
    if (window.location.pathname === "/") return;

    const verificarExpiracion = () => {
      const token = localStorage.getItem("token");
      const loginTimestamp = localStorage.getItem("loginTimestamp");

      if (!token || !loginTimestamp) return;

      const tiempoTranscurrido = Date.now() - parseInt(loginTimestamp, 10);

      if (tiempoTranscurrido > TIEMPO_LIMITE_SESION) {
        setOpenModal(true);
      }
    };

    const identificadorIntervalo = setInterval(
      verificarExpiracion,
      INTERVALO_REVISION,
    );

    return () => clearInterval(identificadorIntervalo);
  }, []);

  useEffect(() => {
    let temporizadorRegresivo: ReturnType<typeof setInterval> | undefined;

    if (openModal) {
      setCountdown(5);

      temporizadorRegresivo = setInterval(() => {
        setCountdown((segundosActuales) => {
          if (segundosActuales <= 1) {
            clearInterval(temporizadorRegresivo);
            cerrarSesionInmediato();
            return 0;
          }
          return segundosActuales - 1;
        });
      }, 1000);
    }

    return () => {
      if (temporizadorRegresivo) clearInterval(temporizadorRegresivo);
    };
  }, [openModal]);

  return (
    <>
      {children}

      <Dialog
        open={openModal}
        maxWidth="xs"
        fullWidth
        disableEscapeKeyDown
        slotProps={{
          paper: {
            sx: { borderRadius: 3, p: 1 },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#ee9105",
            fontWeight: "bold",
          }}
        >
          <WarningAmberRoundedIcon color="warning" />
          Tu sesión está por expirar
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Por razones de seguridad institucional, necesitas confirmar si
            deseas continuar con la sesión.
          </Typography>

          <Box
            sx={{
              p: 1.5,
              bgcolor: "#fff3e0",
              borderRadius: 2,
              textAlign: "center",
              border: "1px solid #ffe0b2",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "#e65100", fontWeight: "bold" }}
            >
              Cierre automático en: {countdown} segundos
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={cerrarSesionInmediato}
            variant="outlined"
            color="error"
            sx={{ borderRadius: 2, fontWeight: "bold", textTransform: "none" }}
          >
            Salir del Sistema
          </Button>
          <Button
            onClick={extenderSesion}
            variant="contained"
            color="primary"
            autoFocus
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              backgroundColor: "#1976d2",
              textTransform: "none",
            }}
          >
            Seguir Conectado
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
