"use client";

import { useState, useEffect } from "react";
import SesionesTemplate from "../../../components/SesionesTemplate";

export default function SesionesArtesPage() {
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  return (
    <SesionesTemplate
      tituloPagina="Comisión Especial de Artes"
      endpointConvocatorias="comision-artes/sesiones"
      labelUnico="Sesiones"
      rol={rolUsuario}
    />
  );
}
