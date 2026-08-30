"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext"; // 👈 ajusta la ruta si tu carpeta context está en otro nivel

const AnimatedBox = motion.create(Box);
const AnimatedPaper = motion.create(Paper);

const PERFILES = [
  { id: "Secretaria del Consejo", label: "Secretaría del Consejo" },
  { id: "Secretaria Auxiliar 1", label: "Secretaría Auxiliar 1" },
  { id: "Secretaria Auxiliar 2", label: "Secretaría Auxiliar 2" },
  { id: "Asistente Ejecutiva", label: "Asistente Ejecutiva" },
  { id: "Coordinadora", label: "Coordinadora" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // 👈 nuevo
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 NUEVO: Estado para mostrar/ocultar contraseña
  const [year, setYear] = useState<number | null>(null);
  const [errorLogin, setErrorLogin] = useState<string | null>(null);

  const base_api = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "";

  const AUTH_LOGIN_URL = `${base_api}/api/v1/auth/login`;

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorLogin(null);

    if (!usuario || !password) {
      setErrorLogin("Por favor, selecciona tu perfil e ingresa la contraseña.");
      return;
    }

    try {
      const respuesta = await fetch(AUTH_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usuario, password }),
      });

      const resultado = await respuesta.json();
      if (resultado.success) {
        localStorage.clear();
        localStorage.setItem("userRole", resultado.role); // Navbar lo sigue usando

        // login() de AuthContext ya guarda token + userData en localStorage
        // Y ACTUALIZA el estado de React en memoria (esto es lo que faltaba)
        login(resultado.token, {
          id: resultado.id ?? resultado.userId ?? "",
          nombre: resultado.nombre ?? resultado.username ?? usuario,
          rol: resultado.role,
        });

        router.push("/dashboard");
      } else {
        setErrorLogin(resultado.error || "Contraseña o perfil incorrectos.");
      }
    } catch (error) {
      setErrorLogin("No se pudo conectar con el servidor.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0d1527",
        backgroundImage: `
          radial-gradient(circle at 85% 15%, rgba(15, 79, 194, 0.25) 0%, transparent 55%),
          radial-gradient(circle at 15% 85%, rgba(222, 134, 11, 0.05) 0%, transparent 45%)
        `,
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <AnimatedPaper
        elevation={24}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{
          display: "flex",
          flexDirection: "row",
          borderRadius: 4,
          overflow: "hidden",
          width: "100%",
          maxWidth: 880,
          minHeight: { xs: "auto", md: 540 },
          boxShadow: "0px 30px 70px rgba(0, 0, 0, 0.5)",
          background: "#ffffff",
        }}
      >
        <Box
          sx={{
            flex: 1,
            background: "#fdfefe",
            borderRight: "1px solid rgba(0, 0, 0, 0.06)",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <AnimatedBox
            animate={{
              x: ["0%", "60%", "-20%", "40%", "0%"],
              y: ["0%", "40%", "80%", "20%", "0%"],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            sx={{
              position: "absolute",
              top: "15%",
              left: "10%",
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(0, 61, 165, 0.15) 0%, rgba(0, 61, 165, 0) 70%)",
              filter: "blur(10px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          <AnimatedBox
            animate={{
              x: ["0%", "-50%", "30%", "-20%", "0%"],
              y: ["0%", "-60%", "-20%", "40%", "0%"],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            sx={{
              position: "absolute",
              bottom: "15%",
              right: "10%",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(222, 134, 11, 0.18) 0%, rgba(222, 134, 11, 0) 70%)",
              filter: "blur(8px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          <AnimatedBox
            animate={{
              x: ["0%", "40%", "80%", "10%", "0%"],
              y: ["0%", "-40%", "20%", "-60%", "0%"],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            sx={{
              position: "absolute",
              top: "45%",
              left: "5%",
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(217, 21, 21, 0.1) 0%, rgba(217, 21, 21, 0) 70%)",
              filter: "blur(12px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          <Box sx={{ zIndex: 2, display: "flex", justifyContent: "center" }}>
            <Image
              src="/CAAHYA.png"
              alt="CAAHYA Logo"
              width={350}
              height={150}
              style={{
                objectFit: "contain",
                filter: "drop-shadow(0px 4px 10px rgba(0,39,101,0.06))",
              }}
              priority
            />
          </Box>

          <Typography
            variant="h4"
            sx={{
              color: "#de860b",
              fontWeight: 800,
              mt: 4,
              mb: 1.5,
              textAlign: "center",
              fontFamily: "'Playfair Display', Georgia, serif",
              zIndex: 2,
              fontSize: "1.85rem",
              letterSpacing: "-0.5px",
            }}
          >
            Bienvenido al <br /> Sistema CAAHyA
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#566573",
              textAlign: "center",
              mt: 2,
              maxWidth: "290px",
              lineHeight: 1.6,
              fontWeight: 400,
              zIndex: 2,
              fontSize: "0.85rem",
            }}
          >
            Control de Informacion del Consejo Academico del Area de las
            Humanidades y Artes
          </Typography>
        </Box>

        {/* PANEL DERECHO - BLANCO ABSOLUTO (Formulario) */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: { xs: 3, sm: 5, md: 6 },
            background: "#ffffff",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#003DA5",
              textAlign: "center",
              mb: 4,
              fontWeight: 700,
            }}
          >
            Iniciar Sesión
          </Typography>

          <Box component="form" onSubmit={handleLogin} noValidate>
            <AnimatePresence mode="wait">
              {errorLogin && (
                <AnimatedBox
                  key="login-error"
                  initial={{ opacity: 0, x: [-10, 10, -10, 10, 0] }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <Alert
                    severity="error"
                    variant="filled"
                    sx={{ mb: 2, borderRadius: 2 }}
                  >
                    {errorLogin}
                  </Alert>
                </AnimatedBox>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <FormControl
                fullWidth
                margin="normal"
                variant="outlined"
                required
              >
                <InputLabel id="perfil-select-label">
                  Selecciona tu perfil
                </InputLabel>
                <Select
                  labelId="perfil-select-label"
                  id="perfil-select"
                  value={usuario}
                  label="Selecciona tu perfil"
                  onChange={(e) => setUsuario(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  {PERFILES.map((perfil) => (
                    <MenuItem key={perfil.id} value={perfil.id}>
                      {perfil.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Contraseña"
                type={showPassword ? "text" : "password"} // 👈 NUEVO: Cambia dinámicamente según el estado
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                required
                InputProps={{
                  // 👈 NUEVO: Añade el botón del ojo al final del input
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": { borderRadius: "8px" },
                }}
              />

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  sx={{
                    mt: 4,
                    borderRadius: 2,
                    fontWeight: "bold",
                    p: 1.5,
                    background:
                      "linear-gradient(135deg, #003DA5 0%, #002b80 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #002b80 0%, #001f5c 100%)",
                    },
                  }}
                >
                  Iniciar Sesión →
                </Button>
              </motion.div>
            </motion.div>
          </Box>

          <Typography
            variant="caption"
            sx={{
              textAlign: "center",
              mt: 8,
              color: "text.secondary",
            }}
          >
            © {year || 2026} CAAHyA — Todos los derechos reservados
          </Typography>
        </Box>
      </AnimatedPaper>
    </Box>
  );
}