const express = require("express");
const router = express.Router();
const { obtener, crear, actualizar, eliminar } = require("../controllers/secretaria-consejo/comisionEspecialActas.controller");

router.get("/", obtener);
router.post("/", crear);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

module.exports = router;