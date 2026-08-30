"use client";
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
  Link,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Navbar from "../components/Navbar";
import InstrumentosTable from "../components/MediaTable";
import { useInstrumentosEvaluacion } from "../hooks/useIsntrumentoEvaluacion";

export default function InstrumentosEvaluacionPage() {
  const {
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    archivo,
    instrumentos,
    cargando,
    subiendo,
    notificacion,
    setNotificacion,
    handleFileChange,
    handleSubmit,
    handleEliminar,
  } = useInstrumentosEvaluacion();

  const titleSx = {
    mb: 3,
    mt: 3,
    fontWeight: 700,
    fontStyle: "italic",
    fontFamily: "'Playfair Display', Georgia, serif",
    color: "#ee9105",
    textAlign: "center",
    fontSize: { xs: "1.6rem", sm: "2rem", md: "2.125rem" },
  } as const;

  const columnas = [
    { key: "titulo", label: "Título", accessor: "titulo" },
    { key: "descripcion", label: "Descripción", accessor: "descripcion" },
    { key: "nombreArchivo", label: "Archivo", accessor: "nombreArchivo" },
    { key: "fechaSubida", label: "Fecha de Subida", accessor: "fechaSubida" },
  ];

  const datosFormateadosParaTabla = instrumentos.map((doc) => ({
    ...doc,
    fechaSubida: new Date(doc.fechaSubida).toLocaleDateString("es-MX"),
    nombreArchivo: (
      <Link
        href={doc.archivoBase64}
        target="_blank"
        rel="noopener noreferrer"
        underline="always"
        onClick={(e) => e.stopPropagation()}
        sx={{
          color: "#ee9105",
          fontWeight: "bold",
          cursor: "pointer",
          "&:hover": { color: "#d48104" },
        }}
      >
        {doc.nombreArchivo}
      </Link>
    ),
  }));

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", pb: 5 }}>
      <Navbar />
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" sx={titleSx}>
          Instrumentos de Evaluación
        </Typography>

        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          sx={{ p: 4, mb: 4, borderRadius: 2 }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 600, color: "#333" }}
          >
            Subir Nuevo Instrumento (PDF)
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Título del Documento"
              variant="outlined"
              fullWidth
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
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
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ bgcolor: "#ee9105", "&:hover": { bgcolor: "#d48104" } }}
              >
                Seleccionar PDF
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>

              <Typography variant="body2" color="text.secondary">
                {archivo
                  ? `Archivo seleccionado: ${archivo.name}`
                  : "Ningún archivo seleccionado"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                disabled={!titulo || !descripcion || !archivo || subiendo}
              >
                {subiendo ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Guardar Instrumento"
                )}
              </Button>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Registros Existentes
          </Typography>
          {cargando ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <InstrumentosTable data={instrumentos} onDelete={handleEliminar} />
          )}
        </Paper>
      </Container>

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
