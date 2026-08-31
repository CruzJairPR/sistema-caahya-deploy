"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import Navbar from "../../../../components/Navbar";
import MediaTable from "../../../../components/MediaTable";
import BannerInstitucional from "../../../../components/BannerInstitucional";
import { useRevisadoraMedia } from "../../../../hooks/useRevisadoraMedia";

export default function InstrumentosEvaluacionPage() {
  const params = useParams();
  const idiomaRaw = (params?.idioma as string) || "";

  const idiomaFormateado = decodeURIComponent(idiomaRaw)
    .replace(/-/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());

  const [tipoExamenTab, setTipoExamenTab] = useState<"dominio" | "metodologia">(
    "dominio",
  );
  const [modalAbierto, setModalAbierto] = useState(false);
  const [rolUsuario, setRolUsuario] = useState<string>("");

  useEffect(() => {
    const roleSaved = localStorage.getItem("userRole") || "";
    setRolUsuario(roleSaved);
  }, []);

  const esSoloConsulta = rolUsuario === "ASISTENTE_EJECUTIVA";

  const endpointDinamico = `instrumentos-evaluacion/${idiomaRaw}/${
    tipoExamenTab === "dominio" ? "examen-de-dominio" : "examen-de-metodologia"
  }`;

  const {
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    comentarios,
    setComentarios,
    fechaArchivo,
    setFechaArchivo,
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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar rol={rolUsuario} />
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}
      >
        <BannerInstitucional
          titulo={` Instrumentos de Evaluación - ${idiomaFormateado}`}
        />

        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3, mb: 3 }}>
          <Tabs
            value={tipoExamenTab}
            onChange={(_, nuevoValor) => setTipoExamenTab(nuevoValor)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Examen de Dominio" value="dominio" />
            <Tab label="Examen de Metodología" value="metodologia" />
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
            {tipoExamenTab === "dominio"
              ? `Exámenes de Dominio (${idiomaFormateado})`
              : `Exámenes de Metodología (${idiomaFormateado})`}
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
              Subir Instrumento
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
              labelColumnaArchivo="Documento de Instrumento"
              readOnly={esSoloConsulta}
            />
          )}
        </Paper>
      </Container>

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
            {editandoId ? "Editar Instrumento" : "Subir Nuevo Instrumento"}
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
                  label="Título del Instrumento"
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
                  disabled={subiendo}
                />
                <TextField
                  label="Comentarios"
                  fullWidth
                  multiline
                  rows={2}
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  disabled={subiendo}
                />
                <TextField
                  label="Fecha del Archivo"
                  type="date"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={fechaArchivo}
                  onChange={(e) => setFechaArchivo(e.target.value)}
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
                disabled={!titulo || (!editandoId && !archivo) || subiendo}
              >
                {subiendo ? (
                  <CircularProgress size={22} color="inherit" />
                ) : editandoId ? (
                  "Actualizar Instrumento"
                ) : (
                  "Guardar Instrumento"
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
