"use client";

import React from "react";
import { Paper, Typography } from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import { motion } from "framer-motion";

interface BannerInstitucionalProps {
  titulo: string;
}

const AnimatedPaper = motion.create(Paper);
const AnimatedIcon = motion.create(SchoolIcon);

export default function BannerInstitucional({
  titulo,
}: BannerInstitucionalProps) {
  const unamColors = {
    dark: "#ee9105",
  };

  return (
    <AnimatedPaper
      elevation={0}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      sx={{
        p: { xs: 4, sm: 5 },
        mb: 4,
        borderRadius: 4,
        background: `linear-gradient(135deg, #065c01, ${unamColors.dark}, #002b80, #8f078f)`,
        backgroundSize: "400% 400%",
        animation: "gradientFlow 14s ease infinite",
        color: "white",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0px 14px 40px rgba(0, 61, 165, 0.12)",
        "@keyframes gradientFlow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <AnimatedIcon
        animate={{
          rotate: [-10, -6, -14, -10],
          scale: [1, 1.06, 0.96, 1],
          opacity: [0.05, 0.08, 0.04, 0.05],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        sx={{
          position: "absolute",
          right: -10,
          bottom: -20,
          fontSize: 180,
        }}
      />

      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 800,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: { xs: "1.8rem", sm: "2.4rem" },
          letterSpacing: "-0.2px",
        }}
      >
        {titulo}
      </Typography>
    </AnimatedPaper>
  );
}
