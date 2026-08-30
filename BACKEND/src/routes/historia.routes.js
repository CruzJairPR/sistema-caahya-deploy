const express = require("express");
const router = express.Router();
const {
    obtenerhistoria,
    crearhistoria,
    actualizarhistoria,
    eliminarhistoria
} = require("../controllers/historia.controller");

router.route("/")
    .get(obtenerhistoria)
    .post(crearhistoria);

router.route("/:id")
    .put(actualizarhistoria)
    .delete(eliminarhistoria);

module.exports = router;