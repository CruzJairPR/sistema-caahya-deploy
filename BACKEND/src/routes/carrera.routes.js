const express = require('express');
const router = express.Router();
const carrerasController = require('../controllers/secretaria-aux2/carrera.controller');
const mediaController = require('../controllers/mediaCarrera.controller');

// --- 1. Rutas de Sesiones ---
router.get('/:carrera/sesiones', (req, res) => {
    req.params.tipo = 'sesiones';
    return mediaController.obtenerPorTipoYCarrera(req, res);
});
router.post('/:carrera/sesiones', (req, res) => {
    req.params.tipo = 'sesiones';
    return mediaController.crearMedia(req, res);
});
router.put('/:carrera/sesiones/:id', (req, res) => {
    req.params.tipo = 'sesiones';
    return mediaController.actualizarMedia(req, res);
});
router.delete('/:carrera/sesiones/:id', mediaController.eliminarMedia);

// --- 2. Rutas de Plan de Trabajo ---
router.get('/:carrera/plan-trabajo', (req, res) => {
    req.params.tipo = 'plan-trabajo';
    return mediaController.obtenerPorTipoYCarrera(req, res);
});
router.post('/:carrera/plan-trabajo', (req, res) => {
    req.params.tipo = 'plan-trabajo';
    return mediaController.crearMedia(req, res);
});
router.put('/:carrera/plan-trabajo/:id', (req, res) => {
    req.params.tipo = 'plan-trabajo';
    return mediaController.actualizarMedia(req, res);
});
router.delete('/:carrera/plan-trabajo/:id', mediaController.eliminarMedia);

// --- 3. Rutas de Miembros (Siempre al final para evitar capturar los endpoints anteriores) ---
router.get('/:carrera', carrerasController.obtenerPorCarrera);
router.post('/:carrera', carrerasController.crearParaCarrera);
router.put('/:carrera/:id', carrerasController.actualizarRegistro);
router.delete('/:carrera/:id', carrerasController.eliminarRegistro);

module.exports = router;