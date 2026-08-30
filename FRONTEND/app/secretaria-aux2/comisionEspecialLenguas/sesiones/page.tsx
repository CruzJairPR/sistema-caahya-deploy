"use client";

import { useState, useEffect } from "react";
import SesionesTemplate from "../../../components/SesionesTemplate";

export default function SesionesComisionPage() {
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  return (
    <SesionesTemplate
      tituloPagina="Sesiones de Comisión"
      endpointConvocatorias="sesiones?tipo=convocatoria&categoria=comision"
      endpointMinutas="sesiones?tipo=minuta&categoria=comision"
      rol={rolUsuario}
    />
  );
}
