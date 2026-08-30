const express = require("express");
const router = express.Router();
const {
    obtenerSesionesArtes,
    crearSesionArtes,
    actualizarSesionArtes,
    eliminarSesionArtes,
} = require("../controllers/sesionesArtes.controller");

router.get("/", obtenerSesionesArtes);
router.post("/", crearSesionArtes);
router.put("/:id", actualizarSesionArtes);
router.delete("/:id", eliminarSesionArtes);

module.exports = router;