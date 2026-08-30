const express = require("express");
const router = express.Router();
const {
    obtenerArquitectura,
    crearArquitectura,
    actualizarArquitectura,
    eliminarArquitectura
} = require("../controllers/arquitectura.controller");

router.route("/")
    .get(obtenerArquitectura)
    .post(crearArquitectura);

router.route("/:id")
    .put(actualizarArquitectura)
    .delete(eliminarArquitectura);

module.exports = router;