// src/routes/sesionesRevisadora.routes.js
const express = require("express");
const router = express.Router();
const {
    obtenerSesionesRevisadora,
    crearSesionRevisadora,
    actualizarSesionRevisadora,
    eliminarSesionRevisadora,
} = require("../controllers/sesionesRevisadora.controller");

router.get("/", obtenerSesionesRevisadora);
router.post("/", crearSesionRevisadora);
router.put("/:id", actualizarSesionRevisadora);
router.delete("/:id", eliminarSesionRevisadora);

module.exports = router;