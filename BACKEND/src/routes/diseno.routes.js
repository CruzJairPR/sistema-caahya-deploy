const express = require("express");
const router = express.Router();
const {
    obtenerDiseno,
    crearDiseno,
    actualizarDiseno,
    eliminarDiseno
} = require("../controllers/diseno.controller");

router.route("/")
    .get(obtenerDiseno)
    .post(crearDiseno);

router.route("/:id")
    .put(actualizarDiseno)
    .delete(eliminarDiseno);

module.exports = router;