"use client";

import { useState, useEffect } from "react";
import SesionesTemplate from "../../../components/SesionesTemplate";

export default function SubcomisionPage() {
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  return (
    <SesionesTemplate
      tituloPagina="Sesiones de la Subcomisión"
      endpointConvocatorias="sesiones?tipo=convocatoria&categoria=subcomision"
      endpointMinutas="sesiones?tipo=minuta&categoria=subcomision"
      rol={rolUsuario}
    />
  );
}
