const express = require("express");
const router = express.Router();
const {
    obtenerAlertasPorRol,
    posponerAlerta,
    crearAlerta,
} = require("../controllers/alerta.controller");

// Asumiendo que tienes un middleware de autenticación (ej: verificarToken)
// const verificarToken = require("../middlewares/authMiddleware");

// GET: /api/v1/alertas (Trae las alertas del rol)
router.get("/", obtenerAlertasPorRol);

// PUT: /api/v1/alertas/:id/posponer (Marca la alerta como leída/atendida)
router.put("/:id/posponer", posponerAlerta);

// POST: /api/v1/alertas (Para generar alertas nuevas)
router.post("/", crearAlerta);

module.exports = router;