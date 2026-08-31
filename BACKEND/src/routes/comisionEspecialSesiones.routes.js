const express = require("express");
const router = express.Router();
const { obtener, crear, actualizar, eliminar } = require("../controllers/secretaria-aux2/comisionEspecialSesiones.controller");

router.get("/", obtener);
router.post("/", crear);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

module.exports = router;