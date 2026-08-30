const express = require("express");
const router = express.Router();
const {
    obtenerPedagogia,
    crearPedagogia,
    actualizarPedagogia,
    eliminarPedagogia
} = require("../controllers/pedagogia.controller");

router.route("/")
    .get(obtenerPedagogia)
    .post(crearPedagogia);

router.route("/:id")
    .put(actualizarPedagogia)
    .delete(eliminarPedagogia);

module.exports = router;