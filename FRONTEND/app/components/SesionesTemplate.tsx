"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Snackbar,
  Alert,
  TextField,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "../components/Navbar";
import MediaTable from "../components/MediaTable";
import BannerInstitucional from "../components/BannerInstitucional";
import { useRevisadoraMedia } from "../hooks/useRevisadoraMedia";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface SesionesTemplateProps {
  tituloPagina: string;
  endpointConvocatorias: string; // Se usa como el endpoint principal
  endpointMinutas?: string; // Opcional: si no se pasa, actúa sin tabs
  labelUnico?: string; // Opcional: nombre singular si es una sola sección (ej: "Plan de Trabajo")
  rol?: string; // Prop opcional para controlar los permisos de la asistente ejecutiva
}

export default function SesionesTemplate({
  tituloPagina,
  endpointConvocatorias,
  endpointMinutas,
  labelUnico,
  rol = "",
}: SesionesTemplateProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Asistente Ejecutiva es solo consulta
  const esSoloConsulta = rol === "ASISTENTE_EJECUTIVA";

  // Determinamos si funciona con una sola sección o con dos (tabs)
  const esUnico = !endpointMinutas;

  const hookConvocatorias = useRevisadoraMedia(endpointConvocatorias);
  const hookMinutas = useRevisadoraMedia(endpointMinutas || "");
  const activeHook = esUnico
    ? hookConvocatorias
    : tabIndex === 0
      ? hookConvocatorias
      : hookMinutas;

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (esSoloConsulta) return;
    await activeHook.handleSubmit();
    setModalAbierto(false);
  };

  const abrirModalCrear = () => {
    if (esSoloConsulta) return;
    activeHook.resetForm();
    setModalAbierto(true);
  };

  const abrirModalEditar = (item: any) => {
    if (esSoloConsulta) return;
    activeHook.handleStartEdit(item);
    setModalAbierto(true);
  };

  const eliminarSeguro = (id: any) => {
    if (esSoloConsulta) return;
    activeHook.handleEliminar(id);
  };

  // Nombres dinámicos para los textos según el modo
  const nombreSeccion = esUnico
    ? labelUnico || "Registro"
    : tabIndex === 0
      ? "Convocatoria"
      : "Minuta";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar rol={rol} />
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}
      >
        <BannerInstitucional titulo={tituloPagina} />

        {/* Solo muestra los Tabs si hay dos endpoints definidos */}
        {!esUnico && (
          <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 4 }}>
            <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}>
              <Tab label="Convocatorias" sx={{ fontWeight: 600 }} />
              <Tab label="Minutas" sx={{ fontWeight: 600 }} />
            </Tabs>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 4,
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
            {esUnico
              ? `Lista de ${nombreSeccion}`
              : tabIndex === 0
                ? "Lista de Convocatorias"
                : "Lista de Minutas"}
          </Typography>
          {!esSoloConsulta && (
            <Button
              variant="contained"
              startIcon={<PostAddIcon />}
              onClick={abrirModalCrear}
              sx={{ bgcolor: "#1b7c0a", "&:hover": { bgcolor: "#169708" } }}
            >
              {esUnico
                ? `Subir ${nombreSeccion}`
                : tabIndex === 0
                  ? "Subir Convocatoria"
                  : "Subir Minuta"}
            </Button>
          )}
        </Box>

        {/* Renderizado de contenido (Con pestañas o en modo sección única) */}
        {esUnico ? (
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
              mt: esSoloConsulta ? 3 : 0,
            }}
          >
            {hookConvocatorias.cargando ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <MediaTable
                data={hookConvocatorias.archivosListado || []}
                onDelete={eliminarSeguro}
                onEdit={abrirModalEditar}
                fileIcon={<DescriptionIcon sx={{ color: "#1f4e79" }} />}
                labelColumnaArchivo={`Documento de ${nombreSeccion}`}
                readOnly={esSoloConsulta}
              />
            )}
          </Paper>
        ) : (
          [hookConvocatorias, hookMinutas].map((hook, index) => (
            <CustomTabPanel key={index} value={tabIndex} index={index}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                  mt: esSoloConsulta ? 3 : 0,
                }}
              >
                {hook.cargando ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <MediaTable
                    data={hook.archivosListado || []}
                    onDelete={eliminarSeguro}
                    onEdit={abrirModalEditar}
                    fileIcon={<DescriptionIcon sx={{ color: "#1f4e79" }} />}
                    labelColumnaArchivo={
                      index === 0
                        ? "Documento de Convocatoria"
                        : "Documento de Minuta"
                    }
                    readOnly={esSoloConsulta}
                  />
                )}
              </Paper>
            </CustomTabPanel>
          ))
        )}
      </Container>

      {/* Modal único para el template */}
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
            {activeHook.editandoId ? `Editar` : `Subir Nuevo`} {nombreSeccion}
            <IconButton
              onClick={() => setModalAbierto(false)}
              disabled={activeHook.subiendo}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Box component="form" onSubmit={handleGuardar}>
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
    </Box>
  );
}
