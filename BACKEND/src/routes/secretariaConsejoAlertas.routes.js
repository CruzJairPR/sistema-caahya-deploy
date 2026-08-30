const express = require("express");
const router = express.Router();
const { obtenerResumenAlertas } = require("../controllers/secretariaConsejoAlertas.controller");

router.get("/resumen", obtenerResumenAlertas);

module.exports = router;