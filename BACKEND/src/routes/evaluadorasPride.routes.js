const express = require("express");
const router = express.Router();
const {
    obtenerEvaluadoras,
    crearEvaluadora,
    actualizarEvaluadora,
    eliminarEvaluadora,
} = require("../controllers/evaluadorasPride.controller");

// Si tienes un middleware de autenticación (JWT), puedes importarlo e incluirlo aquí:
// const verificarToken = require("../middlewares/authMiddleware");

// Rutas base: /api/v1/evaluadorasPride
router.get("/", obtenerEvaluadoras);
router.post("/", crearEvaluadora);
router.put("/:id", actualizarEvaluadora);
router.delete("/:id", eliminarEvaluadora);

module.exports = router;