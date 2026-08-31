const express = require('express');
const router = express.Router();
const controller = require('../controllers/secretaria-aux2/planTrabajo.controller')('difusion-extension');

router.get('/', controller.obtenerPlanes);
router.post('/', controller.crearPlan);
router.put('/:id', controller.actualizarPlan);
router.delete('/:id', controller.eliminarPlan);

module.exports = router;