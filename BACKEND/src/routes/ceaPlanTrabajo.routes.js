const express = require('express');
const router = express.Router();
const controller = require('../controllers/planTrabajo.controller')('comision-especial-artes');

router.get('/', controller.obtenerPlanes);
router.post('/', controller.crearPlan);
router.put('/:id', controller.actualizarPlan);
router.delete('/:id', controller.eliminarPlan);

module.exports = router;