"use client";

import { useState, useEffect } from "react";
import SesionesTemplate from "../../../components/SesionesTemplate";

export default function PagePlanTrabajo() {
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  return (
    <SesionesTemplate
      tituloPagina="Comisión de Difusión y Extensión - Plan de Trabajo y Avances"
      endpointConvocatorias="difusion/plan-trabajo"
      labelUnico="Plan de Trabajo"
      rol={rolUsuario}
    />
  );
}
