const express = require('express');
const router = express.Router();
const {
    obtenerRegistros,
    crearRegistro,
    actualizarRegistro,
    eliminarRegistro
} = require('../controllers/revisoraIdiomas.controller');

// Endpoints GET y POST (Listar y Crear)
router.get('/:idioma/:tipo', obtenerRegistros);
router.post('/:idioma/:tipo', crearRegistro);

// Endpoints PUT y DELETE incluyendo el idioma y tipo para que coincidan con el hook
router.put('/:idioma/:tipo/:id', actualizarRegistro);
router.delete('/:idioma/:tipo/:id', eliminarRegistro);

module.exports = router;