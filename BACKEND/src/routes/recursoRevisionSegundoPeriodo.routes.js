const express = require("express");
const router = express.Router();
const {
    obtenerRecursos,
    crearRecurso,
    actualizarRecurso,
    eliminarRecurso,
} = require("../controllers/secretaria-consejo/recursoRevisionSegundoPeriodo.controller");

router.get("/", obtenerRecursos);
router.post("/", crearRecurso);
router.put("/:id", actualizarRecurso);
router.delete("/:id", eliminarRecurso);

module.exports = router;