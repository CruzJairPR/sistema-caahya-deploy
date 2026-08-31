const express = require('express');
const router = express.Router();
const {
    obtenerRegistros,
    crearRegistro,
    actualizarRegistro,
    eliminarRegistro
} = require('../controllers/secretaria-aux2/instrumentosEvaluacion.controller');

router.get('/:idioma/:tipo', obtenerRegistros);
router.post('/:idioma/:tipo', crearRegistro);
router.put('/:idioma/:tipo/:id', actualizarRegistro);
router.delete('/:idioma/:tipo/:id', eliminarRegistro);

module.exports = router;