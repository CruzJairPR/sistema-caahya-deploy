"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface NotificationContextType {
  mostrarNotificacion: (mensaje: string, tipo?: AlertColor) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [alerta, setAlerta] = useState<{
    mensaje: string;
    tipo: AlertColor;
  } | null>(null);

  const mostrarNotificacion = (
    mensaje: string,
    tipo: AlertColor = "success",
  ) => {
    setAlerta({ mensaje, tipo });
  };

  const cerrarNotificacion = () => {
    setAlerta(null);
  };

  return (
    <NotificationContext.Provider value={{ mostrarNotificacion }}>
      {children}

      {/* Componente unificado para toda la aplicación */}
      <Snackbar
        open={alerta !== null}
        autoHideDuration={4000}
        onClose={cerrarNotificacion}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={cerrarNotificacion}
          severity={alerta?.tipo || "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alerta?.mensaje}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

// Hook personalizado para usarlo fácilmente
export const useNotificacion = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificacion debe usarse dentro de un NotificationProvider",
    );
  }
  return context;
};
