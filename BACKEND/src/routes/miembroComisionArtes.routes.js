const express = require('express');
const router = express.Router();
const {
    obtenerMiembroComisionArtes,
    crearMiembroComisionArtes,
    actualizarMiembroComisionArtes,
    eliminarMiembroComisionArtes
} = require('../controllers/secretaria-aux2/miembroComisionArtes.controller');

router.route('/')
    .get(obtenerMiembroComisionArtes)
    .post(crearMiembroComisionArtes);

router.route('/:id')
    .put(actualizarMiembroComisionArtes)
    .delete(eliminarMiembroComisionArtes);

module.exports = router;