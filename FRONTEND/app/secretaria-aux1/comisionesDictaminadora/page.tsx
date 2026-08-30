"use client";

import { useState, useEffect, useMemo } from "react";
import { Container, Box, CircularProgress } from "@mui/material";
import Navbar from "../../components/Navbar";
import GenericTable, { ColumnConfig } from "../../components/GenericTable";
import { ComisionDictaminadora } from "../../types/catalogo";
import { useCatalogo } from "../../hooks/useCatalogo";
import { useNotifications } from "../../hooks/useNotifications";
import BannerInstitucional from "../../components/BannerInstitucional";
import { calcularUrgenciaPorFechas } from "../../utils/alertasFechas";

type ComisionDictaminadoraRow = ComisionDictaminadora & {
  urgencia?: string;
  _id?: string;
};

const columnasComisiones: ColumnConfig<ComisionDictaminadoraRow>[] = [
  { key: "urgencia", label: "Urgencia", hidden: true },
  { key: "Entidad", label: "Entidad", required: true },
  { key: "Comision", label: "Comisión", required: true },
  { key: "Miembro", label: "Miembro", required: true },
  { key: "Adscripcion", label: "Adscripción" },
  { key: "Categoria y nivel", label: "Categoría" },
  { key: "Fuente de Designacion", label: "Fuente de Designación" },
  { key: "Periodo", label: "Periodo" },
  { key: "Inicio", label: "Fecha Inicio", type: "date" },
  { key: "Termino", label: "Fecha Término", type: "date" },
  { key: "Permanencia", label: "Permanencia" },
  { key: "Observaciones", label: "Observaciones" },
  { key: "Prefencias de areas CAAHyA", label: "Preferencias CAAHyA" },
  {
    key: "Ultima modificacion a la base",
    label: "Última Modificación",
    type: "date",
  },
  { key: "Miembro anterior", label: "Miembro Anterior" },
];

const corregirTextoConEnes = (texto: string): string => {
  if (!texto) return "";
  return texto.replace(/\bano(s)?\b/gi, "año$1").replace(/ano\b/gi, "año");
};

export default function ComisionesDictaminadorasPage() {
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  // Asistente Ejecutiva es solo consulta: no puede agregar, modificar ni eliminar comisiones
  const esSoloConsulta = rolUsuario === "ASISTENTE_EJECUTIVA";

  const { datos, cargando, agregarComision, editarComision, eliminarComision } =
    useCatalogo<ComisionDictaminadora>("comisiones", "");

  // useGlobalAlertasSecretaria1 (montado en el layout/nivel superior) ya
  // registra la alerta agrupada (id 9000) para esta tabla. Este componente
  // solo necesita calcular `urgencia` para pintar el semáforo de la tabla.
  useNotifications(rolUsuario);

  const datosConUrgenciaAutomatica = useMemo(() => {
    return (datos as ComisionDictaminadoraRow[]).map((item) => {
      const permanenciaCorregida = item.Permanencia
        ? corregirTextoConEnes(String(item.Permanencia))
        : item.Permanencia;

      return {
        ...item,
        Permanencia: permanenciaCorregida,
        // Se recalcula siempre desde la fecha (barato y puro) — ya no
        // confía en un `urgencia` cacheado potencialmente obsoleto.
        urgencia: calcularUrgenciaPorFechas(
          item.Termino as string | Date | undefined,
        ),
      };
    });
  }, [datos]);

  const handleAdd = async (nuevaComision: any) => {
    if (esSoloConsulta) return;
    try {
      await agregarComision(nuevaComision);
    } catch (error) {
      console.error("Error al agregar la comisión:", error);
    }
  };

  const handleEdit = async (row: ComisionDictaminadoraRow) => {
    if (esSoloConsulta || !row._id) return;
    try {
      await editarComision(row._id, row);
    } catch (error) {
      console.error("Error al editar la comisión:", error);
    }
  };

  const handleDelete = async (row: ComisionDictaminadoraRow) => {
    if (esSoloConsulta || !row._id) return;
    try {
      await eliminarComision(row._id);
    } catch (error) {
      console.error("Error al eliminar la comisión:", error);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar rol={rolUsuario} />

      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, sm: 4 },
          px: { xs: 1, sm: 3, md: 4 },
        }}
      >
        <BannerInstitucional titulo="Comisiones Dictaminadoras" />

        {cargando ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: { xs: 4, sm: 8 },
            }}
          >
            <CircularProgress sx={{ color: "#ee9105" }} />
          </Box>
        ) : (
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <GenericTable<ComisionDictaminadoraRow>
              data={datosConUrgenciaAutomatica}
              rowKey="_id"
              displayField="Miembro"
              columns={columnasComisiones}
              title="Detalles de la Comisión"
              contextoActual="Comisiones Dictaminadoras"
              editTitle="Modificar Detalles y Urgencia"
              readOnly={esSoloConsulta}
              onAdd={esSoloConsulta ? undefined : handleAdd}
              onEdit={esSoloConsulta ? undefined : handleEdit}
              onDelete={esSoloConsulta ? undefined : handleDelete}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
