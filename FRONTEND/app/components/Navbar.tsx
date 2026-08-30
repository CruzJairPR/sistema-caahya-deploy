"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  Badge,
  IconButton,
  List,
  ListItem,
  Divider,
  Drawer,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { LogoutOutlined, CalendarToday, TableChart } from "@mui/icons-material";
import { saveToHistory } from "../utils/history";
import { useAlertasCampana } from "../context/AlertasCampanaContext";
import { NavMenuDropdown } from "./NavMenuDropdown";
import { MobileNavItem } from "./MobileNavItem";
import { MENU_PERFILES } from "../menuConfig";

// Hooks globales de alertas
import { useGlobalAlertasSecretaria1 } from "../hooks/useGlobalAlertasSecretaria1";
import { useGlobalAlertasSecretariaConsejo } from "../hooks/useGlobalAlertasSecretariaConsejo";
import { useGlobalAlertasPride } from "../hooks/useGlobalAlertasPride";
import { useGlobalAlertasSecretariaAux2 } from "../hooks/useGlobalAlertasSecretariaAux2";

export default function Navbar({ rol }: { rol?: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [perfilActivo, setPerfilActivo] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return rol || localStorage.getItem("userRole") || "";
    }
    return rol || "";
  });

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  const {
    notificaciones,
    totalAlertas,
    tieneAlertasActivas,
    posponerNotificacion,
    irAMiembros,
  } = useAlertasCampana();

  const rolNormalizado = perfilActivo.toLowerCase();

  useGlobalAlertasSecretaria1(rolNormalizado);
  useGlobalAlertasSecretariaConsejo(rolNormalizado);
  useGlobalAlertasPride(rolNormalizado);
  useGlobalAlertasSecretariaAux2(rolNormalizado);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sincronizamos por si la prop 'rol' cambia externamente
  useEffect(() => {
    if (rol) {
      setPerfilActivo(rol);
    }
  }, [rol]);

  const opciones = perfilActivo ? MENU_PERFILES[perfilActivo] || [] : [];
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!mounted) {
    return (
      <AppBar
        position="static"
        sx={{ backgroundColor: "#003DA5", boxShadow: 0 }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#FFFFFF" }}
            >
              CAAHYA
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: "#003DA5", boxShadow: 2 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
              onClick={() => {
                saveToHistory("Inicio", "/dashboard");
                router.push("/dashboard");
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#FFFFFF" }}
              >
                CAAHYA
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#FFD700", fontWeight: "600" }}
              >
                Consultas
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {opciones.map((item, index) => (
              <NavMenuDropdown
                key={`desktop-${item.label}-${index}`}
                item={item}
                onCloseParent={() => {}}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <IconButton
              color="inherit"
              onClick={() => setNotifDrawerOpen(true)}
            >
              <Badge badgeContent={totalAlertas} color="error">
                <NotificationsIcon
                  sx={{ color: tieneAlertasActivas ? "#FFD700" : "#fff" }}
                />
              </Badge>
            </IconButton>

            {perfilActivo && (
              <Box
                sx={{
                  ml: 2,
                  mr: 1,
                  borderLeft: "1px solid rgba(255,255,255,0.3)",
                  pl: 2,
                  display: { xs: "none", md: "block" },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#FFD700", display: "block", lineHeight: 1 }}
                >
                  Usuario:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#fff", fontWeight: "bold" }}
                >
                  {perfilActivo.replace(/_/g, " ")}
                </Typography>
              </Box>
            )}

            <Button
              onClick={handleLogout}
              sx={{
                color: "#fff",
                textTransform: "none",
                ml: 1,
                display: { xs: "none", md: "flex" },
                "&:hover": { color: "#FFD700" },
              }}
            >
              <LogoutOutlined sx={{ mr: 0.5 }} />
              Salir
            </Button>
          </Box>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: { width: { xs: "100%", sm: 400 }, bgcolor: "#f8f9fa", p: 0 },
          },
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#003DA5",
            color: "#fff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <NotificationsIcon sx={{ color: "#FFD700" }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
            >
              Alertas y Pendientes
            </Typography>
          </Box>
          <IconButton
            onClick={() => setNotifDrawerOpen(false)}
            sx={{ color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 2 }}>
          <List dense disablePadding>
            {notificaciones.length > 0 ? (
              notificaciones.map((n, index) => (
                <ListItem
                  key={n.id ? `${n.id}-${index}` : `notif-${index}`}
                  disablePadding
                  sx={{
                    flexDirection: "column",
                    alignItems: "stretch",
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#ffffff",
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                    borderLeft:
                      n.tipo === "alerta"
                        ? "5px solid #d32f2f"
                        : "5px solid #003DA5",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: n.tipo === "alerta" ? 700 : 500,
                      color: "#333",
                      lineHeight: 1.4,
                      mb: n.tablaOrigen ? 1 : 0,
                    }}
                  >
                    {n.texto}
                  </Typography>

                  {n.tablaOrigen && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#003DA5",
                        fontWeight: "bold",
                        bgcolor: "rgba(0, 61, 165, 0.08)",
                        p: "2px 8px",
                        borderRadius: "4px",
                        alignSelf: "flex-start",
                        mb: 1,
                      }}
                    >
                      Tabla: {n.tablaOrigen}
                    </Typography>
                  )}

                  {n.accion === "miembros" && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mt: 2,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        startIcon={<CalendarToday sx={{ fontSize: 14 }} />}
                        onClick={() => posponerNotificacion(n.id)}
                        sx={{
                          textTransform: "none",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >
                        Posponer
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<TableChart sx={{ fontSize: 14 }} />}
                        onClick={() =>
                          irAMiembros(
                            "Revisión desde Alerta",
                            () => setNotifDrawerOpen(false),
                            n.tablaOrigen,
                          )
                        }
                        sx={{
                          textTransform: "none",
                          fontSize: "0.75rem",
                          bgcolor: "#003DA5",
                          fontWeight: "bold",
                          "&:hover": { bgcolor: "#002d80" },
                        }}
                      >
                        Ver Tabla
                      </Button>
                    </Box>
                  )}
                </ListItem>
              ))
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  px: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <NotificationsIcon
                  sx={{ fontSize: 48, color: "text.disabled", opacity: 0.5 }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontWeight: 500 }}
                >
                  No tienes notificaciones pendientes
                </Typography>
              </Box>
            )}
          </List>
        </Box>
      </Drawer>

      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: { backgroundColor: "#003DA5", color: "#FFFFFF", width: 280 },
          },
        }}
      >
        <Box sx={{ pt: 3 }} role="presentation">
          {perfilActivo && (
            <Box sx={{ px: 2, pb: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: "#FFD700", display: "block" }}
              >
                Perfil Activo:
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {perfilActivo.replace(/_/g, " ")}
              </Typography>
            </Box>
          )}
          <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
          <List>
            {opciones.map((item, index) => (
              <MobileNavItem
                key={`mobile-${item.label}-${index}`}
                item={item}
                onCloseDrawer={() => setMobileDrawerOpen(false)}
              />
            ))}
          </List>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 1 }} />
          <List>
            <ListItem disablePadding>
              <Button
                onClick={handleLogout}
                fullWidth
                sx={{
                  color: "#FFD700",
                  justifyContent: "flex-start",
                  px: 2,
                  py: 1.5,
                  textTransform: "none",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    color: "#FFD700",
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LogoutOutlined />
                </Box>
                Cerrar Sesión
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
