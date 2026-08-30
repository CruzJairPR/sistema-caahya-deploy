const express = require('express');
const router = express.Router();
const miembroController = require('../controllers/miembro.controller');

router.get('/', miembroController.obtenerMiembros);
router.post('/', miembroController.crearMiembro);
router.put('/:id', miembroController.actualizarMiembro);
router.delete('/:id', miembroController.eliminarMiembro);

module.exports = router;