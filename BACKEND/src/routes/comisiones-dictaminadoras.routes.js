const express = require('express');
const router = express.Router();
const { 
    obtenerComisionesDictaminadoras, 
    crearComisionDictaminadora 
} = require('../controllers/comisiones-dictaminadoras.controller');

router.route('/')
    .get(obtenerComisionesDictaminadoras)
    .post(crearComisionDictaminadora);

module.exports = router;