const express = require("express");
const router = express.Router();
const {
    obtenerSesiones,
    crearSesion,
    actualizarSesion,
    eliminarSesion,
} = require("../controllers/sesionesDifusion.controller");

// Endpoints
router.get("/", obtenerSesiones);
router.post("/", crearSesion);
router.put("/:id", actualizarSesion);
router.delete("/:id", eliminarSesion);

module.exports = router;