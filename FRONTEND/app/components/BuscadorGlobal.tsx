"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { buscarEnSistema, SearchResult } from "../utils/searchService";
import { saveToHistory } from "../utils/history";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "15%",
  left: "50%",
  transform: "translate(-50%, 0)",
  width: { xs: "90%", sm: 600 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: 3,
  outline: "none",
};

export default function BuscadorGlobal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<SearchResult[]>([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("userRole") || "");
  }, [open]);

  const handleSearch = (text: string) => {
    setQuery(text);
    setResultados(buscarEnSistema(text, role));
  };

  const handleSelection = (item: SearchResult) => {
    saveToHistory(`Buscador: ${item.titulo}`, item.path);

    setOpen(false);
    setQuery("");
    setResultados([]);
    router.push(item.path);
  };

  return (
    <>
      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: "#ee9105",
          textTransform: "none",
          fontWeight: "bold",
          borderRadius: 2,
          py: 1.2,
          "&:hover": { bgcolor: "#d68203" },
        }}
      >
        Buscador Global
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#003DA5" }}>
              Buscar en el Sistema
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            autoFocus
            variant="outlined"
            placeholder="Escribe el nombre de un miembro, oficio, dictamen..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#003DA5" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 2 }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            {role === "COORDINADORA"
              ? "Buscando en todas las tablas del sistema."
              : `Filtrando resultados autorizados para el perfil: ${role.replace(/_/g, " ")}`}
          </Typography>

          <Divider sx={{ my: 1 }} />

          <List sx={{ maxHeight: 300, overflow: "auto", mt: 1 }}>
            {resultados.length > 0
              ? resultados.map((item) => (
                  <ListItemButton
                    key={item.id}
                    onClick={() => handleSelection(item)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      border: "1px solid #f0f0f0",
                      "&:hover": { bgcolor: "#f0f7ff", borderColor: "#1976d2" },
                    }}
                  >
                    <ListItemText
                      primary={item.titulo}
                      secondary={item.subtitulo}
                      slotProps={{
                        primary: {
                          fontWeight: 600,
                          color: "#333",
                        },
                        secondary: {
                          fontSize: "0.8rem",
                        },
                      }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={item.modulo}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                      />
                      <ArrowForwardIosIcon
                        sx={{ fontSize: 12, color: "text.disabled" }}
                      />
                    </Box>
                  </ListItemButton>
                ))
              : query.trim() !== "" && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlignment: "center", py: 3, textAlign: "center" }}
                  >
                    No se encontraron resultados que coincidan o no tienes
                    permisos para verlos.
                  </Typography>
                )}
          </List>
        </Box>
      </Modal>
    </>
  );
}
