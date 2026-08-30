const express = require("express");
const router = express.Router();
const {
    obtenerfilosofia,
    crearfilosofia,
    actualizarfilosofia,
    eliminarfilosofia
} = require("../controllers/filosofia.controller");

router.route("/")
    .get(obtenerfilosofia)
    .post(crearfilosofia);

router.route("/:id")
    .put(actualizarfilosofia)
    .delete(eliminarfilosofia);

module.exports = router;