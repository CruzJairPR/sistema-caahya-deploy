const express = require("express");
const router = express.Router();
const {
    obtenerActasRevisadora,
    crearActaRevisadora,
    actualizarActaRevisadora,
    eliminarActaRevisadora,
} = require("../controllers/actasRevisadora.controller");

router.get("/", obtenerActasRevisadora);
router.post("/", crearActaRevisadora);
router.put("/:id", actualizarActaRevisadora);
router.delete("/:id", eliminarActaRevisadora);

module.exports = router;