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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "../../components/Navbar";
import MediaTable from "../../components/MediaTable";
import { useMedia } from "../../hooks/useMedia";
import BannerInstitucional from "../../components/BannerInstitucional";

export default function FormatosWordPage() {
  const [rolUsuario, setRolUsuario] = useState<string>("");
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  const esSoloConsulta = rolUsuario === "ASISTENTE_EJECUTIVA";

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
    handleFileChange,
    handleSubmit,
    handleEliminar,
    idEditando,
    handleEdit,
    cancelarEdicion,
  } = useMedia("word");

  const handleGuardarFormato = async (e: React.FormEvent) => {
    e.preventDefault();
    if (esSoloConsulta) return;
    await handleSubmit();
    setModalAbierto(false);
  };

  const abrirModalCrear = () => {
    if (esSoloConsulta) return;
    cancelarEdicion();
    setModalAbierto(true);
  };

  const abrirModalEditar = (item: any) => {
    if (esSoloConsulta) return;
    handleEdit(item);
    setModalAbierto(true);
  };

  const eliminarSeguro = (id: any) => {
    if (esSoloConsulta) return;
    handleEliminar(id);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", pb: 5 }}>
      <Navbar rol={rolUsuario} />
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <BannerInstitucional titulo="FORMATOS WORD" />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 4,
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
            Formatos Disponibles
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
              Subir Nuevo Formato
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
              labelColumnaArchivo="Formato Word"
              readOnly={esSoloConsulta}
              mostrarComentarios={false}
              mostrarFechaArchivo={false}
            />
          )}
        </Paper>
      </Container>

      {/* Modal para Crear / Editar */}
      {!esSoloConsulta && (
        <Dialog
          open={modalAbierto}
          onClose={() => {
            if (!subiendo) {
              setModalAbierto(false);
              cancelarEdicion();
            }
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              fontWeight: 600,
              color: "#333",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {idEditando ? "Editar Formato" : "Subir Formato (.doc, .docx)"}
            <IconButton
              aria-label="close"
              onClick={() => {
                setModalAbierto(false);
                cancelarEdicion();
              }}
              disabled={subiendo}
              sx={{ color: (theme) => theme.palette.grey[500] }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <Box component="form" onSubmit={handleGuardarFormato}>
            <DialogContent dividers sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  label="Título del Documento"
                  variant="outlined"
                  fullWidth
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  disabled={subiendo}
                />

                <TextField
                  label="Descripción / Observaciones"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                  disabled={subiendo}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    disabled={subiendo}
                    sx={{
                      color: "#ee9105",
                      borderColor: "#ee9105",
                      "&:hover": {
                        borderColor: "#d48104",
                        bgcolor: "rgba(238, 145, 5, 0.04)",
                      },
                    }}
                  >
                    Seleccionar Archivo
                    <input
                      type="file"
                      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      hidden
                      onChange={handleFileChange}
                    />
                  </Button>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: "250px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {archivo
                      ? archivo.name
                      : idEditando
                        ? "Mantener archivo actual"
                        : "Ningún archivo seleccionado"}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2.5 }}>
              <Button
                onClick={() => {
                  setModalAbierto(false);
                  cancelarEdicion();
                }}
                color="inherit"
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
                  (!idEditando && !archivo) ||
                  subiendo
                }
              >
                {subiendo ? (
                  <CircularProgress size={22} color="inherit" />
                ) : idEditando ? (
                  "Actualizar Formato"
                ) : (
                  "Guardar Formato"
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
