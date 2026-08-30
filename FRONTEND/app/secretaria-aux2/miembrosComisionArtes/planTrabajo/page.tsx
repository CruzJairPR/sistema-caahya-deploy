"use client";

import { useState, useEffect } from "react";
import SesionesTemplate from "../../../components/SesionesTemplate";

export default function PagePlanTrabajoArtes() {
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  return (
    <SesionesTemplate
      tituloPagina="Comisión Especial de Artes - Plan de Trabajo y Avances"
      endpointConvocatorias="artes/plan-trabajo"
      labelUnico="Plan de Trabajo"
      rol={rolUsuario}
    />
  );
}
