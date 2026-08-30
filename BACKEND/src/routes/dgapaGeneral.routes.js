const express = require('express');
const router = express.Router();
const {
    obtenerDgapaGeneralPorPestana,
    crearComision,
    actualizarDgapaGeneral,
    eliminarDgapaGeneral
} = require('../controllers/dgapa.controller');

router.get('/:pestana', obtenerDgapaGeneralPorPestana);

router.post('/:pestana', crearComision);

router.put('/:id', actualizarDgapaGeneral);

router.delete('/:id', eliminarDgapaGeneral);

module.exports = router;