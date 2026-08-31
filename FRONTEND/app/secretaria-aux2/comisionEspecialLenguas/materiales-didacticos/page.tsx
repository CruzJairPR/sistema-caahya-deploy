"use client";

import { useState, useEffect } from "react";
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
import Navbar from "../../../components/Navbar";
import MediaTable from "../../../components/MediaTable";
import BannerInstitucional from "../../../components/BannerInstitucional";
import { useRevisadoraMedia } from "../../../hooks/useRevisadoraMedia";

export default function MaterialesDidacticosPage() {
  // Estado para controlar las pestañas: "videos" | "ppt" | "pdf"
  const [tipoMaterialTab, setTipoMaterialTab] = useState<
    "videos" | "ppt" | "pdf"
  >("videos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  // Asistente Ejecutiva es solo consulta: no puede subir, editar ni eliminar materiales didácticos
  const esSoloConsulta = rolUsuario === "ASISTENTE_EJECUTIVA";

  // Endpoint dinámico para el hook
  const endpointDinamico = `materiales-didacticos/${tipoMaterialTab}`;

  const {
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    archivo,
    archivosListado,
    cargando,
    subiendo,
    notificacion,
    setNotificacion,
    editandoId,
    handleFileChange,
    handleStartEdit,
    handleSubmit,
    handleEliminar,
    resetForm,
  } = useRevisadoraMedia(endpointDinamico);

  const abrirModalCrear = () => {
    if (esSoloConsulta) return;
    resetForm();
    setModalAbierto(true);
  };

  const abrirModalEditar = (item: any) => {
    if (esSoloConsulta) return;
    handleStartEdit(item);
    setModalAbierto(true);
  };

  const handleGuardar = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (esSoloConsulta) return;
    await handleSubmit();
    setModalAbierto(false);
  };

  const eliminarSeguro = (id: any) => {
    if (esSoloConsulta) return;
    handleEliminar(id);
  };

  // Texto legible para los títulos según la pestaña activa
  const obtenerTituloSeccion = () => {
    if (tipoMaterialTab === "videos") return "Videos Didácticos";
    if (tipoMaterialTab === "ppt") return "Presentaciones PPT";
    return "Documentos PDF";
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar rol={rolUsuario} />
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}
      >
        <BannerInstitucional titulo="Materiales Didácticos" />

        {/* Pestañas (Tabs) para Videos, PPT y PDF */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3, mb: 3 }}>
          <Tabs
            value={tipoMaterialTab}
            onChange={(_, nuevoValor) => setTipoMaterialTab(nuevoValor)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Videos" value="videos" />
            <Tab label="Presentaciones PPT" value="ppt" />
            <Tab label="Documentos PDF" value="pdf" />
          </Tabs>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
            {obtenerTituloSeccion()}
          </Typography>

          {!esSoloConsulta && (
            <Button
              variant="contained"
              startIcon={<PostAddIcon />}
              onClick={abrirModalCrear}
              sx={{
                bgcolor: "#1b7c0a",
                "&:hover": { bgcolor: "#169708" },
                fontWeight: 600,
              }}
            >
              Subir Material
            </Button>
          )}
        </Box>

        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
            mt: esSoloConsulta ? 3 : 0,
          }}
        >
          {cargando ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <MediaTable
              data={archivosListado || []}
              onDelete={eliminarSeguro}
              onEdit={abrirModalEditar}
              fileIcon={<DescriptionIcon sx={{ color: "#1f4e79" }} />}
              labelColumnaArchivo="Documento o Archivo"
              readOnly={esSoloConsulta}
            />
          )}
        </Paper>
      </Container>

      {/* MODAL CREAR / EDITAR */}
      {!esSoloConsulta && (
        <Dialog
          open={modalAbierto}
          onClose={() => !subiendo && setModalAbierto(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {editandoId ? "Editar Material" : "Subir Nuevo Material"}
            <IconButton
              onClick={() => setModalAbierto(false)}
              disabled={subiendo}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Box component="form" onSubmit={handleGuardar}>
            <DialogContent dividers sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  label="Título del Material"
                  fullWidth
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  disabled={subiendo}
                />
                <TextField
                  label="Descripción"
                  fullWidth
                  multiline
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                  disabled={subiendo}
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
                      accept=".pdf,.mp4,.avi,.mov,.ppt,.pptx,.doc,.docx,.png,.jpg"
                      hidden
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    {archivo
                      ? archivo.name
                      : editandoId
                        ? "Mantener archivo actual (opcional cambiar)"
                        : "Ningún archivo seleccionado"}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
              <Button
                onClick={() => setModalAbierto(false)}
                disabled={subiendo}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                disabled={
                  !titulo ||
                  !descripcion ||
                  (!editandoId && !archivo) ||
                  subiendo
                }
              >
                {subiendo ? (
                  <CircularProgress size={22} color="inherit" />
                ) : editandoId ? (
                  "Actualizar Material"
                ) : (
                  "Guardar Material"
                )}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      )}

      <Snackbar
        open={!!notificacion}
        autoHideDuration={4000}
        onClose={() => setNotificacion(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {notificacion ? (
          <Alert
            severity={notificacion.tipo}
            variant="filled"
            onClose={() => setNotificacion(null)}
          >
            {notificacion.mensaje}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
