const express = require('express');
const router = express.Router();
const EspecialPride = require('../models/EspecialPride');
const crearControladorPride = require('../controllers/pride.controller'); 

const controller = crearControladorPride(EspecialPride);

router.get('/', controller.obtenerTodos);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;