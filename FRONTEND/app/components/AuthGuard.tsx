"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si ya terminó de cargar y no hay usuario, redirigir
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Mientras está cargando el estado del Auth, mostramos un spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Si hay usuario, renderiza el contenido
  return <>{children}</>;
};