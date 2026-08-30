// app/comision-especial-pride/actas/page.tsx
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
import Navbar from "../../../components/Navbar";
import MediaTable from "../../../components/MediaTable";
import BannerInstitucional from "../../../components/BannerInstitucional";
import { useRevisadoraMedia } from "../../../hooks/useRevisadoraMedia";

export default function ComisionEspecialActasPage() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  // Asistente Ejecutiva es solo consulta: no puede subir/editar/eliminar actas
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
    editandoId,
    handleFileChange,
    handleStartEdit,
    handleSubmit,
    handleEliminar,
    resetForm,
  } = useRevisadoraMedia("comisionEspecialActas");

  const abrirModalCrear = () => {
    resetForm();
    setModalAbierto(true);
  };

  const abrirModalEditar = (item: any) => {
    handleStartEdit(item);
    setModalAbierto(true);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
    setModalAbierto(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar rol={rolUsuario} />
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}
      >
        <BannerInstitucional titulo="Actas - Comisión Especial PRIDE" />

        {!esSoloConsulta && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              mb: 4,
            }}
          >
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
              Subir Nueva Acta
            </Button>
          </Box>
        )}

        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
            mt: esSoloConsulta ? 3 : 0,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 600, mb: 2, color: "#333" }}
          >
            Actas Registradas
          </Typography>

          {cargando ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <MediaTable
              data={archivosListado}
              onDelete={handleEliminar}
              onEdit={abrirModalEditar}
              fileIcon={<DescriptionIcon sx={{ color: "#1f4e79" }} />}
              labelColumnaArchivo="Documento de Acta"
              readOnly={esSoloConsulta}
            />
          )}
        </Paper>
      </Container>

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
          {editandoId ? "Editar Acta" : "Subir Nueva Acta"}
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
                label="Título del Acta"
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
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg"
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
            <Button onClick={() => setModalAbierto(false)} disabled={subiendo}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={
                !titulo || !descripcion || (!editandoId && !archivo) || subiendo
              }
            >
              {subiendo ? (
                <CircularProgress size={22} color="inherit" />
              ) : editandoId ? (
                "Actualizar Acta"
              ) : (
                "Guardar Acta"
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

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
