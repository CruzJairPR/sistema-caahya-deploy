const express = require('express');
const router = express.Router();
const directorioController = require('../controllers/directorio.controller');

router.get('/', directorioController.obtenerDirectorios);
router.post('/', directorioController.crearDirectorio);
router.put('/:id', directorioController.actualizarDirectorio);
router.delete('/:id', directorioController.eliminarDirectorio);

module.exports = router;