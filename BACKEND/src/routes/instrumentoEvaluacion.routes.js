const express = require("express");
const router = express.Router();
const {
    obtenerInstrumentos,
    crearInstrumento,
    eliminarInstrumento,
} = require("../controllers/instrumentoEvaluacionController");

router.get("/", obtenerInstrumentos);
router.post("/", crearInstrumento);
router.delete("/:id", eliminarInstrumento);

module.exports = router;