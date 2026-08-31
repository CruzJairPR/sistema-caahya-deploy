"use client";

import { useState, useEffect } from "react";
import SesionesTemplate from "../../../components/SesionesTemplate";

export default function PlanTrabajoPage() {
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  return (
    <SesionesTemplate
      tituloPagina="COEL - Plan de Trabajo y Avances"
      endpointConvocatorias="plan-trabajo-coel"
      labelUnico="Plan de Trabajo"
      rol={rolUsuario}
    />
  );
}
