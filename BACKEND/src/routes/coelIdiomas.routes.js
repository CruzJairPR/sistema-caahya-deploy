const express = require('express');
const router = express.Router();
const {
    obtenerCoelIdiomas,
    crearCoelIdioma,
    actualizarCoelIdioma,
    eliminarCoelIdioma
} = require('../controllers/coelIdiomas.controller');

// Endpoints dinámicos que manejan cualquier idioma y tipo de examen
router.get('/:idioma/:tipo', obtenerCoelIdiomas);
router.post('/:idioma/:tipo', crearCoelIdioma);

// Endpoints para modificar o borrar por ID único
router.put('/:id', actualizarCoelIdioma);
router.delete('/:id', eliminarCoelIdioma);

module.exports = router;