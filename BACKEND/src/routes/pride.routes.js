const express = require('express');
const router = express.Router();
const prideCtrl = require('../controllers/comisionpride.controller');

// GET    /api/v1/pride          → listar con filtros y paginación
// GET    /api/v1/pride/:id      → obtener por ID
// POST   /api/v1/pride          → crear registro
// PUT    /api/v1/pride/:id      → actualizar registro
// DELETE /api/v1/pride/:id      → eliminar registro

router.get('/', prideCtrl.getAll);
router.get('/:id', prideCtrl.getById);
router.post('/', prideCtrl.create);
router.put('/:id', prideCtrl.update);
router.delete('/:id', prideCtrl.remove);

module.exports = router;