const express = require('express');
const router = express.Router();

const {
    obtenerDifusion,
    crearDifusion,
    actualizarDifusion,
    eliminarDifusion
} = require('../controllers/difusion.controller');

router.route('/')
    .get(obtenerDifusion)
    .post(crearDifusion);

router.route('/:id')
    .put(actualizarDifusion)
    .delete(eliminarDifusion);

module.exports = router;