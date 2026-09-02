"use client";

import React, { useState, useMemo } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  TablePagination,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  whiteSpace: "nowrap",
  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
}));

const COLORES_URGENCIA: Record<string, string> = {
  vencido: "#d32f2f",
  critico: "#d32f2f",
  advertencia: "#c8a30d",
};

const getNestedValue = (obj: unknown, path: string): unknown => {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
};

const setNestedValue = (
  obj: Record<string, unknown>,
  path: string,
  value: string,
): Record<string, unknown> => {
  const keys = path.split(".");
  const result = { ...obj };

  if (keys.length === 1) {
    result[keys[0]] = value;
    return result;
  }

  let current: Record<string, unknown> = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const next = current[key] as Record<string, unknown> | undefined;
    current[key] = { ...(next ?? {}) };
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;

  return result;
};

const formatearFechaVisual = (val: unknown) => {
  if (!val) return "—";
  const strVal = String(val);
  const parsed = dayjs(strVal);
  if (parsed.isValid() && (strVal.includes("-") || strVal.includes("/"))) {
    return parsed.format("DD/MM/YYYY");
  }
  return strVal;
};

export interface ColumnConfig<T = unknown> {
  key: keyof T | string;
  label: string;
  isChip?: boolean;
  editable?: boolean;
  hidden?: boolean;
  type?: "text" | "date" | "select";
  options?: string[];
  required?: boolean;
}

interface GenericTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  rowKey: keyof T;
  displayField: keyof T;
  title?: string;
  addTitle?: string;
  editTitle?: string;
  contextoActual?: string;
  onAdd?: (newRow: Record<string, string>) => void;
  onEdit?: (updatedRow: T) => void;
  onDelete?: (row: T) => void;
  readOnly?: boolean;
  defaultOrderBy?: string;
  defaultOrder?: "asc" | "desc";
}

type Order = "asc" | "desc";

export default function GenericTable<T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  displayField,
  title,
  addTitle = "Añadir Registro",
  editTitle = "Editar Registro",
  contextoActual,
  onAdd,
  onEdit,
  onDelete,
  readOnly = false,
  defaultOrderBy = "Entidad",
  defaultOrder = "asc",
}: GenericTableProps<T>) {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [order, setOrder] = useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<T | null>(null);

  const [newRowData, setNewRowData] = useState<Record<string, string>>({});
  const [editRowData, setEditRowData] = useState<Record<string, string>>({});
  const [editingRow, setEditingRow] = useState<T | null>(null);

  const visibleColumns = useMemo(
    () => columns.filter((col) => !col.hidden),
    [columns],
  );
  const tituloModalAgregar =
    addTitle ??
    (contextoActual ? `Añadir en ${contextoActual}` : "Añadir Registro");

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredData = useMemo(() => {
    let result = data.filter((row) => {
      if (!row) return false;
      const idVal = row[rowKey];
      return (
        idVal !== undefined && idVal !== null && String(idVal).trim() !== ""
      );
    });

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((row) => {
        if (searchColumn === "all") {
          return columns.some((col) => {
            const value = getNestedValue(row, String(col.key));
            return String(value ?? "")
              .toLowerCase()
              .includes(term);
          });
        }
        const value = getNestedValue(row, searchColumn);
        return String(value ?? "")
          .toLowerCase()
          .includes(term);
      });
    }

    if (orderBy) {
      result.sort((a, b) => {
        const valA = getNestedValue(a, orderBy);
        const valB = getNestedValue(b, orderBy);

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (valB < valA) {
          return order === "asc" ? 1 : -1;
        }
        if (valB > valA) {
          return order === "asc" ? -1 : 1;
        }
        return 0;
      });
    }

    return result;
  }, [
    searchTerm,
    searchColumn,
    data,
    columns,
    order,
    orderBy,
    displayField,
    rowKey,
  ]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [filteredData, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) =>
    setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExportExcel = () => {
    if (!filteredData || filteredData.length === 0) return;

    const datosMapeados = filteredData.map((row) => {
      const filaPlana: Record<string, unknown> = {};

      visibleColumns.forEach((col) => {
        const label = col.label;
        const key = String(col.key);
        const rawValue = getNestedValue(row, key);

        const cellValue =
          col.type === "date" ||
          ["Inicio", "Termino", "Ultima modificacion a la base"].includes(key)
            ? formatearFechaVisual(rawValue)
            : (rawValue ?? "");

        filaPlana[label] = cellValue;
      });

      return filaPlana;
    });

    const worksheet = XLSX.utils.json_to_sheet(datosMapeados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

    const nombreArchivo = title
      ? `${title.replace(/\s+/g, "_")}_Filtrado.xlsx`
      : "Reporte_Tabla.xlsx";

    XLSX.writeFile(workbook, nombreArchivo);
  };

  const handleOpenAddDialog = () => {
    const empty: Record<string, string> = {};
    columns.forEach((col) => {
      empty[String(col.key)] = "";
    });
    setNewRowData(empty);
    setOpenAddDialog(true);
  };

  const handleSaveNewRow = () => {
    if (!onAdd) return;
    (document.activeElement as HTMLElement)?.blur();

    let structuredResult: Record<string, unknown> = {};
    Object.entries(newRowData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        structuredResult = setNestedValue(structuredResult, key, value);
      }
    });

    const hasValues = Object.values(structuredResult).some(
      (val) => String(val).trim() !== "",
    );
    if (!hasValues) return;

    onAdd(structuredResult as Record<string, string>);
    setOpenAddDialog(false);
    setNewRowData({});
  };

  const handleOpenEditDialog = (row: T) => {
    const editData: Record<string, string> = {};
    columns.forEach((col) => {
      const value = getNestedValue(row, String(col.key));
      editData[String(col.key)] = String(value ?? "");
    });
    setEditRowData(editData);
    setEditingRow(row);
    setOpenEditDialog(true);
  };

  const handleSaveEditedRow = () => {
    if (!editingRow) return;
    const updatedRowContainer = { ...editingRow } as Record<string, unknown>;

    columns.forEach((col) => {
      const key = String(col.key);
      const newValue = editRowData[key];
      if (key.includes(".")) {
        const result = setNestedValue(updatedRowContainer, key, newValue);
        Object.assign(updatedRowContainer, result);
      } else {
        updatedRowContainer[key] = newValue;
      }
    });

    if (onEdit) onEdit(updatedRowContainer as T);
    setOpenEditDialog(false);
    setEditingRow(null);
  };

  const handleOpenDeleteDialog = (row: T) => {
    setRowToDelete(row);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (rowToDelete && onDelete) {
      onDelete(rowToDelete);
    }
    setOpenDeleteDialog(false);
    setRowToDelete(null);
  };

  const isFormValid = columns.every((col) => {
    if (col.editable === false) return true;
    const val = newRowData[String(col.key)];
    return val !== undefined && val !== null;
  });

  const isEditFormValid = columns.every(
    (col) =>
      col.editable === false ||
      editRowData[String(col.key)] === undefined ||
      editRowData[String(col.key)] !== null,
  );

  const renderFormFields = (
    formData: Record<string, string>,
    setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  ) => {
    return columns.map((col) => {
      const keyStr = String(col.key);

      // Manejo específico previo (ej. urgencia)
      if (keyStr === "urgencia") {
        return (
          <FormControl key={keyStr} fullWidth size="small">
            <InputLabel>Asignar Urgencia</InputLabel>
            <Select
              value={
                formData[keyStr] === "normal" ? "" : formData[keyStr] || ""
              }
              label="Asignar Urgencia"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [keyStr]: e.target.value,
                }))
              }
            >
              <MenuItem value="">Ninguno (Normal)</MenuItem>
              <MenuItem
                value="critico"
                sx={{ color: COLORES_URGENCIA.critico, fontWeight: "bold" }}
              >
                Rojo (Crítico / 3 meses)
              </MenuItem>
              <MenuItem
                value="advertencia"
                sx={{ color: COLORES_URGENCIA.advertencia, fontWeight: "bold" }}
              >
                Amarillo (Advertencia / 6 meses)
              </MenuItem>
            </Select>
          </FormControl>
        );
      }

      // 💡 2. NUEVO: Renderizado seguro para campos tipo "select" configurados mediante columnas
      if (col.type === "select") {
        return (
          <FormControl
            key={keyStr}
            fullWidth
            size="small"
            required={col.required}
          >
            <InputLabel>{col.label}</InputLabel>
            <Select
              value={formData[keyStr] || ""}
              label={col.label}
              disabled={col.editable === false}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [keyStr]: e.target.value,
                }))
              }
            >
              <MenuItem value="">
                <em>Seleccione una opción</em>
              </MenuItem>
              {col.options?.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }

      if (col.type === "date") {
        return (
          <DatePicker
            key={keyStr}
            label={col.label}
            value={formData[keyStr] ? dayjs(formData[keyStr]) : null}
            onChange={(newValue) => {
              setFormData((prev) => ({
                ...prev,
                [keyStr]:
                  newValue && newValue.isValid()
                    ? newValue.format("YYYY-MM-DD")
                    : "",
              }));
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small",
                variant: "outlined",
              },
            }}
          />
        );
      }

      return (
        <TextField
          key={keyStr}
          label={col.label}
          value={formData[keyStr] ?? ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              [keyStr]: e.target.value,
            }))
          }
          fullWidth
          size="small"
          variant="outlined"
          disabled={col.editable === false}
          required={col.required}
        />
      );
    });
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            flexGrow: 1,
          }}
        >
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 200 } }}>
            <InputLabel>Buscar en...</InputLabel>
            <Select
              value={searchColumn}
              label="Buscar en..."
              onChange={(e) => {
                setSearchColumn(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="all">Todas las columnas</MenuItem>
              {columns.map((col) => (
                <MenuItem key={String(col.key)} value={String(col.key)}>
                  {col.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            placeholder="Escribe para buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportExcel}
            disabled={filteredData.length === 0}
            sx={{ whiteSpace: "nowrap", fontWeight: "bold", py: 1 }}
          >
            Exportar Excel
          </Button>

          {!readOnly && (
            <Button
              variant="contained"
              color="success"
              onClick={handleOpenAddDialog}
              sx={{ whiteSpace: "nowrap", fontWeight: "bold", py: 1 }}
            >
              Agregar
            </Button>
          )}
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          width: "100%",
          overflowX: "auto",
          borderRadius: 2,
          "&::-webkit-scrollbar": { height: 16 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.primary.main,
            borderRadius: 5,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
        }}
      >
        <Table size="small" sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              {visibleColumns.map((col) => {
                const keyStr = String(col.key);
                return (
                  <StyledTableCell key={keyStr}>
                    <TableSortLabel
                      active={orderBy === keyStr}
                      direction={orderBy === keyStr ? order : "asc"}
                      onClick={() => handleRequestSort(keyStr)}
                      sx={{
                        color: "inherit !important",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      {col.label}
                    </TableSortLabel>
                  </StyledTableCell>
                );
              })}
              <StyledTableCell align="center" sx={{ borderRight: "none" }}>
                Acciones
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + 1}
                  align="center"
                  sx={{ py: 4, color: "text.secondary" }}
                >
                  No se encontraron resultados
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const rowId = String(row[rowKey] || rowIndex);
                const urgenciaValor = (row as Record<string, unknown>)
                  .urgencia as string | undefined;
                const colorTexto = urgenciaValor
                  ? COLORES_URGENCIA[urgenciaValor]
                  : undefined;

                const isEven = rowIndex % 2 === 0;
                const zebraBg = isEven
                  ? theme.palette.background.default
                  : theme.palette.action.hover;

                return (
                  <TableRow
                    key={rowId}
                    sx={{
                      backgroundColor: zebraBg,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.06)",
                      },
                    }}
                  >
                    {visibleColumns.map((col) => {
                      const rawValue = getNestedValue(row, String(col.key));
                      const cellValue =
                        col.type === "date" ||
                        [
                          "Inicio",
                          "Termino",
                          "Ultima modificacion a la base",
                        ].includes(String(col.key))
                          ? formatearFechaVisual(rawValue)
                          : (rawValue ?? "—");

                      return (
                        <TableCell
                          key={String(col.key)}
                          sx={{
                            whiteSpace: "nowrap",
                            borderRight: "1px solid rgba(224, 224, 224, 0.6)",
                          }}
                        >
                          {col.isChip ? (
                            <Chip
                              label={String(cellValue)}
                              size="small"
                              variant="outlined"
                            />
                          ) : (
                            <Box
                              component="span"
                              sx={{
                                color: colorTexto || "inherit",
                                fontWeight: colorTexto ? 600 : "normal",
                              }}
                            >
                              {String(cellValue)}
                            </Box>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell align="center" sx={{ borderRight: "none" }}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        {!readOnly && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="warning"
                              onClick={() => handleOpenEditDialog(row)}
                              sx={{ minWidth: "auto", px: 1.5 }}
                            >
                              <EditIcon fontSize="small" />
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => handleOpenDeleteDialog(row)}
                              sx={{ minWidth: "auto", px: 1.5 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                          </>
                        )}
                      </Box>
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
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
      />

      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            color: theme.palette.primary.main,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {tituloModalAgregar}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            {renderFormFields(newRowData, setNewRowData)}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenAddDialog(false)}
            variant="outlined"
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveNewRow}
            variant="contained"
            color="primary"
            disabled={!isFormValid}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            color: theme.palette.primary.main,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {editTitle}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            {renderFormFields(editRowData, setEditRowData)}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenEditDialog(false)}
            variant="outlined"
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEditedRow}
            variant="contained"
            color="primary"
            disabled={!isEditFormValid}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: theme.palette.error.main,
            textAlign: "center",
          }}
        >
          ¿Confirmar Eliminación?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" textAlign="center">
            ¿Estás seguro de que deseas eliminar a{" "}
            <strong>
              {rowToDelete
                ? String(rowToDelete[displayField] ?? "")
                : "este registro"}
            </strong>
            ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2, gap: 2 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ fontWeight: "bold" }}
          >
            Sí, Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
