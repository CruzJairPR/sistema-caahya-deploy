const router = require('express').Router();
const { obtenerFolios, crearFolio, actualizarFolio, eliminarFolio } = require('../controllers/folios.controller');

router.get('/', obtenerFolios);
router.post('/', crearFolio);
router.put('/:id', actualizarFolio);
router.delete('/:id', eliminarFolio);

module.exports = router;