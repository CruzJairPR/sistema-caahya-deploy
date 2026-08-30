const express = require("express");
const router = express.Router();
const {
    obtenerComisiones,
    crearComision,
    actualizarComision,
    eliminarComision
} = require("../controllers/comision.controller");

router.route("/")
    .get(obtenerComisiones)
    .post(crearComision);

router.route("/:id")
    .put(actualizarComision)
    .delete(eliminarComision);

module.exports = router;