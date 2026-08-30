const express = require('express');
const router = express.Router();

const {
    obtenerConvocatorias,
    crearConvocatoria,
    actualizarConvocatoria,
    eliminarConvocatoria,
} = require('../controllers/convocatorias.controller');

router.get('/', obtenerConvocatorias);
router.post('/', crearConvocatoria);
router.put('/:id', actualizarConvocatoria);
router.delete('/:id', eliminarConvocatoria);

module.exports = router;