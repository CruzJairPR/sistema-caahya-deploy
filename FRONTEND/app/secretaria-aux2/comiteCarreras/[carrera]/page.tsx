"use client";

import { use, useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import Navbar from "../../../components/Navbar";
import AdminTable from "../../../components/AdminTable";
import MediaTable from "../../../components/MediaTable";
import { ColumnConfig } from "../../../components/GenericTable";
import { useCarreras } from "../../../hooks/useCarreras";
import { useRevisadoraMedia } from "../../../hooks/useRevisadoraMedia";
import BannerInstitucional from "../../../components/BannerInstitucional";
import DescriptionIcon from "@mui/icons-material/Description";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

export type NivelUrgencia = "vencido" | "critico" | "advertencia" | "normal";

export const calcularUrgenciaPorFechas = (
  fechaTerminoStr?: string | Date,
): NivelUrgencia => {
  if (!fechaTerminoStr) return "normal";

  const hoy = new Date();
  const termino = new Date(fechaTerminoStr);

  if (isNaN(termino.getTime())) return "normal";

  const diffTime = termino.getTime() - hoy.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = diffDays / 30;

  if (diffDays < 0) return "vencido";
  if (diffMonths <= 3) return "critico";
  if (diffMonths <= 6) return "advertencia";

  return "normal";
};

const columnasMiembros: ColumnConfig<any>[] = [
  { key: "carrera", label: "CARRERA" },
  { key: "sede", label: "SEDE" },
  { key: "persona", label: "PERSONA" },
  { key: "nombramiento", label: "NOMBRAMIENTO" },
  { key: "correo", label: "CORREO" },
  { key: "fechaInicio", label: "FECHA INICIO", type: "date" },
  { key: "fechaTermino", label: "FECHA TÉRMINO", type: "date" },
];

const NOMBRES_CARRERAS: Record<string, string> = {
  arquitectura: "ARQUITECTURA",
  carreraDiseno: "DISEÑO",
  diseno: "DISEÑO",
  desarrolloGestion: "DESARROLLO Y GESTIÓN",
  filosofia: "FILOSOFÍA",
  historia: "HISTORIA",
  pedagogia: "PEDAGOGÍA",
};

interface PageProps {
  params: Promise<{ carrera: string }>;
}

export default function CarreraDinamicaPage({ params }: PageProps) {
  const { carrera } = use(params);
  const [pestanaActual, setPestanaActual] = useState<
    "miembros" | "sesiones" | "plan"
  >("miembros");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  const esSoloConsulta = rolUsuario === "ASISTENTE_EJECUTIVA";

  // Mapeamos el endpoint de miembros de forma aislada
  const endpointMiembrosDedicado =
    carrera === "desarrolloGestion"
      ? "desarrolloGestion"
      : carrera === "arquitectura"
        ? "arquitectura"
        : carrera === "diseno"
          ? "diseno"
          : carrera === "pedagogia"
            ? "pedagogia"
            : carrera === "historia"
              ? "historia"
              : carrera === "filosofia"
                ? "filosofia"
                : `carreras/${carrera}`;

  const {
    datos,
    cargando: cargandoMiembros,
    error: errorMiembros,
    notificacion,
    cerrarNotificacion,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useCarreras(endpointMiembrosDedicado);

  // Mantenemos siempre activos ambos hooks para evitar problemas de sincronización de estado al cambiar de pestaña
  const hookSesiones = useRevisadoraMedia(`carreras/${carrera}/sesiones`);
  const hookPlan = useRevisadoraMedia(`carreras/${carrera}/plan-trabajo`);

  // Hook activo según la pestaña seleccionada
  const activeHook = pestanaActual === "sesiones" ? hookSesiones : hookPlan;

  const handleGuardarMedia = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (esSoloConsulta) return;
    await activeHook.handleSubmit();
    setModalAbierto(false);
  };

  const eliminarSeguroSesion = (id: any) => {
    if (esSoloConsulta) return;
    hookSesiones.handleEliminar(id);
  };

  const eliminarSeguroPlan = (id: any) => {
    if (esSoloConsulta) return;
    hookPlan.handleEliminar(id);
  };

  const nombreVisual =
    NOMBRES_CARRERAS[carrera] || (carrera ? carrera.toUpperCase() : "");

  // Procesamos los datos de miembros para inyectarles la urgencia calculada mediante fechaTermino
  const datosMiembrosProcesados = (datos || []).map((item: any) => {
    const fTermino = item.fechaTermino;
    return {
      ...item,
      _id: typeof item._id === "object" ? item._id.toString() : item._id,
      persona: item.persona || "—",
      urgencia: calcularUrgenciaPorFechas(fTermino),
    };
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar rol={rolUsuario} />

      <Container
        maxWidth="lg"
        sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 }, flexGrow: 1 }}
      >
        <BannerInstitucional titulo={`FACULTAD DE ${nombreVisual}`} />

        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3, mb: 3 }}>
          <Tabs
            value={pestanaActual}
            onChange={(_, nuevoValor) => setPestanaActual(nuevoValor)}
            textColor="primary"
            indicatorColor="primary"
            centered
          >
            <Tab label="Miembros" value="miembros" />
            <Tab label="Sesiones" value="sesiones" />
            <Tab label="Plan de Trabajo" value="plan" />
          </Tabs>
        </Box>

        {errorMiembros && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMiembros}
          </Alert>
        )}

        {/* TAB 1: MIEMBROS */}
        {pestanaActual === "miembros" &&
          (cargandoMiembros ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
              <CircularProgress sx={{ color: "#ee9105" }} />
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                overflowX: "auto",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <AdminTable
                data={datosMiembrosProcesados}
                columns={columnasMiembros}
                rowKey="_id"
                displayField="persona"
                title={`Ficha del Miembro: ${nombreVisual}`}
                addTitle={`Añadir Miembro de ${nombreVisual}`}
                editTitle={`Modificar Ficha de ${nombreVisual}`}
                onAdd={esSoloConsulta ? undefined : handleAdd}
                onEdit={esSoloConsulta ? undefined : handleEdit}
                onDelete={esSoloConsulta ? undefined : handleDelete}
              />
            </Box>
          ))}

        {/* TAB 2: SESIONES */}
        {pestanaActual === "sesiones" && (
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
              mt: esSoloConsulta ? 3 : 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                Sesiones
              </Typography>
              {!esSoloConsulta && (
                <Button
                  variant="contained"
                  startIcon={<PostAddIcon />}
                  onClick={() => {
                    hookSesiones.resetForm();
                    setModalAbierto(true);
                  }}
                  sx={{ bgcolor: "#1b7c0a", "&:hover": { bgcolor: "#169708" } }}
                >
                  Subir Sesión
                </Button>
              )}
            </Box>

            {hookSesiones.cargando ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                <CircularProgress sx={{ color: "#ee9105" }} />
              </Box>
            ) : (
              <MediaTable
                data={hookSesiones.archivosListado || []}
                onDelete={eliminarSeguroSesion}
                onEdit={(item) => {
                  if (esSoloConsulta) return;
                  hookSesiones.handleStartEdit(item);
                  setModalAbierto(true);
                }}
                fileIcon={<DescriptionIcon sx={{ color: "#1f4e79" }} />}
                labelColumnaArchivo="Documento de Sesión"
                readOnly={esSoloConsulta}
              />
            )}
          </Paper>
        )}

        {/* TAB 3: PLAN DE TRABAJO */}
        {pestanaActual === "plan" && (
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
              mt: esSoloConsulta ? 3 : 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                Plan de Trabajo
              </Typography>
              {!esSoloConsulta && (
                <Button
                  variant="contained"
                  startIcon={<PostAddIcon />}
                  onClick={() => {
                    hookPlan.resetForm();
                    setModalAbierto(true);
                  }}
                  sx={{ bgcolor: "#1b7c0a", "&:hover": { bgcolor: "#169708" } }}
                >
                  Subir Plan de Trabajo
                </Button>
              )}
            </Box>

            {hookPlan.cargando ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                <CircularProgress sx={{ color: "#ee9105" }} />
              </Box>
            ) : (
              <MediaTable
                data={hookPlan.archivosListado || []}
                onDelete={eliminarSeguroPlan}
                onEdit={(item) => {
                  if (esSoloConsulta) return;
                  hookPlan.handleStartEdit(item);
                  setModalAbierto(true);
                }}
                fileIcon={<DescriptionIcon sx={{ color: "#1f4e79" }} />}
                labelColumnaArchivo="Documento de Plan de Trabajo"
                readOnly={esSoloConsulta}
              />
            )}
          </Paper>
        )}
      </Container>

      {/* Modal Genérico para Subir / Editar Archivos */}
      {!esSoloConsulta && (
        <Dialog
          open={modalAbierto}
          onClose={() => !activeHook.subiendo && setModalAbierto(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {activeHook.editandoId ? `Editar Registro` : `Subir Nuevo Registro`}
            <IconButton
              onClick={() => setModalAbierto(false)}
              disabled={activeHook.subiendo}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Box component="form" onSubmit={handleGuardarMedia}>
            <DialogContent dividers>
              <Stack spacing={3}>
                <TextField
                  label="Título"
                  fullWidth
                  value={activeHook.titulo}
                  onChange={(e) => activeHook.setTitulo(e.target.value)}
                  required
                  disabled={activeHook.subiendo}
                />
                <TextField
                  label="Descripción"
                  fullWidth
                  multiline
                  rows={3}
                  value={activeHook.descripcion}
                  onChange={(e) => activeHook.setDescripcion(e.target.value)}
                  disabled={activeHook.subiendo}
                />
                <TextField
                  label="Comentarios"
                  fullWidth
                  multiline
                  rows={2}
                  value={activeHook.comentarios || ""}
                  onChange={(e) => activeHook.setComentarios(e.target.value)}
                  disabled={activeHook.subiendo}
                />
                <TextField
                  label="Fecha del Archivo"
                  type="date"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={activeHook.fechaArchivo || ""}
                  onChange={(e) => activeHook.setFechaArchivo(e.target.value)}
                  disabled={activeHook.subiendo}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ color: "#ee9105", borderColor: "#ee9105" }}
                  >
                    Seleccionar Archivo
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg"
                      hidden
                      onChange={activeHook.handleFileChange}
                    />
                  </Button>
                  <Typography variant="body2">
                    {activeHook.archivo?.name ||
                      (activeHook.editandoId ? "Mantener actual" : "Ninguno")}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
              <Button
                onClick={() => setModalAbierto(false)}
                disabled={activeHook.subiendo}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                disabled={
                  !activeHook.titulo ||
                  (!activeHook.editandoId && !activeHook.archivo) ||
                  activeHook.subiendo
                }
              >
                {activeHook.subiendo ? (
                  <CircularProgress size={22} color="inherit" />
                ) : activeHook.editandoId ? (
                  "Actualizar"
                ) : (
                  "Guardar"
                )}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      )}

      {/* Snackbar de notificaciones para Sesiones/Plan */}
      <Snackbar
        open={!!activeHook.notificacion}
        autoHideDuration={4000}
        onClose={() => activeHook.setNotificacion(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {activeHook.notificacion ? (
          <Alert
            severity={activeHook.notificacion.tipo}
            variant="filled"
            onClose={() => activeHook.setNotificacion(null)}
          >
            {activeHook.notificacion.mensaje}
          </Alert>
        ) : undefined}
      </Snackbar>

      {/* Snackbar general para Miembros */}
      <Snackbar
        open={notificacion !== null}
        autoHideDuration={4000}
        onClose={cerrarNotificacion}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={cerrarNotificacion}
          severity={notificacion?.tipo ?? "info"}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {notificacion?.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}
