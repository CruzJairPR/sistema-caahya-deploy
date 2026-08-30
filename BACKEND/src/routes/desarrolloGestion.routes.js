const express = require("express");
const router = express.Router();
const {
    obtenerDesarrolloGestion,
    crearDesarrolloGestion,
    actualizarDesarrolloGestion,
    eliminarDesarrolloGestion
} = require("../controllers/desarrolloGestion.controller");

router.route("/")
    .get(obtenerDesarrolloGestion)
    .post(crearDesarrolloGestion);

router.route("/:id")
    .put(actualizarDesarrolloGestion)
    .delete(eliminarDesarrolloGestion);

module.exports = router;