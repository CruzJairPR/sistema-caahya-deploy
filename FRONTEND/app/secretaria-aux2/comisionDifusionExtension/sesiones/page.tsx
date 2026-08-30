"use client";

import { useState, useEffect } from "react";
import SesionesTemplate from "../../../components/SesionesTemplate";

export default function SesionesDifusionPage() {
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  return (
    <SesionesTemplate
      tituloPagina="Comisión Permanente de Difusión y Extensión"
      endpointConvocatorias="comision-difusion/sesiones"
      labelUnico="Sesiones"
      rol={rolUsuario}
    />
  );
}
