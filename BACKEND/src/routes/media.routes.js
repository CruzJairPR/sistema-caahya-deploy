const { Router } = require("express");
const {
    subirMedia,
    obtenerMedia,
    actualizarMedia,
    eliminarMedia
} = require("../controllers/media.controller");

const router = Router();

router.post("/", subirMedia);
router.get("/", obtenerMedia);
router.put("/:id", actualizarMedia); 
router.delete("/:id", eliminarMedia);

module.exports = router;