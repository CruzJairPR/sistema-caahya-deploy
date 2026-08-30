"tsx";
import React, { createContext, useContext, useState, useMemo } from "react";

interface AlertaPrideContextType {
  notificaciones: any[];
  totalAlertas: number;
  tieneAlertasActivas: boolean;
  actualizarAlertasPride: (datos: any[]) => void;
  posponerNotificacion: (id: string) => void;
  irAMiembros: (id: string) => void;
}

const AlertasPrideContext = createContext<AlertaPrideContextType | undefined>(
  undefined,
);

export function AlertasPrideProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notificaciones, setNotificaciones] = useState<any[]>([]);

  // Función que recibe los datos de la tabla PRIDE y calcula las alertas según la urgencia
  const actualizarAlertasPride = (datos: any[]) => {
    // Filtramos los que tengan urgencia alta o próxima a vencer (puedes ajustar el filtro según tu lógica)
    const alertasGeneradas = datos
      .filter(
        (item) =>
          item.urgencia === "Urgente" ||
          item.urgencia === "Por vencer" ||
          item.urgencia === "Rojo" ||
          item.urgencia === "Amarillo",
      )
      .map((item, index) => ({
        id: item._id || String(index),
        titulo: `Miembro: ${item.nombre}`,
        mensaje: `La comisión de ${item.nombre} finaliza pronto (${item.final}).`,
        urgencia: item.urgencia,
      }));

    setNotificaciones(alertasGeneradas);
  };

  const posponerNotificacion = (id: string) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  };

  const irAMiembros = (id: string) => {
    // Lógica opcional para redirigir o enfocar al miembro en la tabla
    console.log("Ir al miembro con ID:", id);
  };

  const totalAlertas = notificaciones.length;
  const tieneAlertasActivas = totalAlertas > 0;

  return (
    <AlertasPrideContext.Provider
      value={{
        notificaciones,
        totalAlertas,
        tieneAlertasActivas,
        actualizarAlertasPride,
        posponerNotificacion,
        irAMiembros,
      }}
    >
      {children}
    </AlertasPrideContext.Provider>
  );
}

export function useAlertasPrideContext() {
  const context = useContext(AlertasPrideContext);
  if (!context) {
    throw new Error(
      "useAlertasPrideContext debe usarse dentro de un AlertasPrideProvider",
    );
  }
  return context;
}
