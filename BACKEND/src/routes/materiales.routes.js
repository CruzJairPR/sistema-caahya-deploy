const express = require('express');
const router = express.Router();

const {
    obtenerMateriales,
    crearMaterial,
    actualizarMaterial,
    eliminarMaterial
} = require('../controllers/materiales.controller');

// Rutas con parámetro :tipo para listar y crear
router.get('/:tipo', obtenerMateriales);
router.post('/:tipo', crearMaterial);

// Rutas por :id único para actualizar y eliminar (coinciden con tu hook)
router.put('/:id', actualizarMaterial);
router.delete('/:id', eliminarMaterial);

module.exports = router;