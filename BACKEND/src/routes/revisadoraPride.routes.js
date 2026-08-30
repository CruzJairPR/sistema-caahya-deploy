const express = require('express');
const router = express.Router();
const RevisadoraPride = require('../models/RevisadoraPride');
const crearControladorPride = require('../controllers/pride.controller');

const controller = crearControladorPride(RevisadoraPride);

router.get('/', controller.obtenerTodos);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;