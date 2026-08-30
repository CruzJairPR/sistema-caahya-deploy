"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  Box,
  Button,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

function descargarArchivoBase64(dataUri: string, nombreArchivo: string) {
  if (!dataUri) return;
  const [header, base64] = dataUri.split(",");
  const mimeMatch = header.match(/data:(.*);base64/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";

  const binario = atob(base64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) {
    bytes[i] = binario.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

interface MediaTableProps {
  data: any[];
  onDelete: (id: string) => void;
  onEdit?: (item: any) => void;
  fileIcon?: React.ReactNode;
  labelColumnaArchivo?: string;
  readOnly?: boolean;
  mostrarComentarios?: boolean; 
  mostrarFechaArchivo?: boolean; 
}

export default function MediaTable({
  data,
  onDelete,
  onEdit,
  fileIcon = <DescriptionIcon />,
  readOnly = false,
  labelColumnaArchivo = "Archivo",
  mostrarComentarios = true,
  mostrarFechaArchivo = true,
}: MediaTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(
      (row) =>
        row.titulo?.toLowerCase().includes(term) ||
        row.descripcion?.toLowerCase().includes(term) ||
        (mostrarComentarios && row.comentarios?.toLowerCase().includes(term)) ||
        row.nombreArchivo?.toLowerCase().includes(term),
    );
  }, [searchTerm, data, mostrarComentarios]);

  const paginatedData = useMemo(
    () =>
      filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredData, page, rowsPerPage],
  );

  let totalColumnas = 4; 
  if (mostrarComentarios) totalColumnas++;
  if (mostrarFechaArchivo) totalColumnas++;
  totalColumnas++; 

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={
            mostrarComentarios
              ? "Buscar por título, descripción, comentarios o archivo..."
              : "Buscar por título, descripción o archivo..."
          }
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        elevation={2}
        sx={{ width: "100%", overflowX: "auto" }}
      >
        <Table size="small" sx={{ minWidth: 850 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Título</StyledTableCell>
              <StyledTableCell>Descripción</StyledTableCell>
              {mostrarComentarios && (
                <StyledTableCell>Comentarios</StyledTableCell>
              )}
              <StyledTableCell>{labelColumnaArchivo}</StyledTableCell>
              {mostrarFechaArchivo && (
                <StyledTableCell>Fecha del Archivo</StyledTableCell>
              )}
              <StyledTableCell>Fecha de Subida</StyledTableCell>
              <StyledTableCell align="center">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={totalColumnas}
                  align="center"
                  sx={{ py: 3 }}
                >
                  No se encontraron resultados
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const rawFecha =
                  row.fechaArchivo ||
                  row.fecha ||
                  row.date ||
                  row.fecha_archivo ||
                  "";
                const fechaLimpia = rawFecha ? rawFecha.split("T")[0] : "";

                // Soporte para fecha de subida (mapeando createdAt o fechaSubida de tu schema de Mongoose)
                const fechaSubidaReal = row.fechaSubida || row.createdAt;

                return (
                  <TableRow key={row._id} hover>
                    <TableCell>{row.titulo}</TableCell>
                    <TableCell>{row.descripcion}</TableCell>
                    {mostrarComentarios && (
                      <TableCell>{row.comentarios || "—"}</TableCell>
                    )}
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={fileIcon}
                        onClick={() =>
                          descargarArchivoBase64(
                            row.archivoBase64,
                            row.nombreArchivo,
                          )
                        }
                        sx={{
                          color: "#ee9105",
                          borderColor: "#ee9105",
                          textAlign: "left",
                          justifyContent: "flex-start",
                          "&:hover": {
                            borderColor: "#d48104",
                            bgcolor: "rgba(238,145,5,0.08)",
                          },
                        }}
                      >
                        {row.nombreArchivo}
                      </Button>
                    </TableCell>

                    {mostrarFechaArchivo && (
                      <TableCell>
                        {fechaLimpia
                          ? new Date(
                              fechaLimpia + "T00:00:00",
                            ).toLocaleDateString("es-MX")
                          : "—"}
                      </TableCell>
                    )}

                    {/* Fecha de Subida */}
                    <TableCell>
                      {fechaSubidaReal
                        ? new Date(fechaSubidaReal).toLocaleDateString(
                            "es-MX",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            },
                          )
                        : "—"}
                    </TableCell>

                    <TableCell align="center">
                      {!readOnly && (
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          {onEdit && (
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() =>
                                onEdit({
                                  ...row,
                                  fechaArchivo: fechaLimpia,
                                })
                              }
                              sx={{ minWidth: "auto", px: 1.5 }}
                            >
                              <EditIcon fontSize="small" />
                            </Button>
                          )}
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => onDelete(row._id)}
                            sx={{ minWidth: "auto", px: 1.5 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Filas por página:"
      />
    </Box>
  );
}
