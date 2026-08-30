const express = require('express');
const router = express.Router();
const coelController = require('../controllers/coel.controller');

router.get('/', coelController.obtenerCoel);
router.post('/', coelController.crearCoel);

module.exports = router;