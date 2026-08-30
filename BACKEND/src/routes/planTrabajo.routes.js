const express = require('express');
const controladorComision = require('../controllers/planTrabajo.controller');

module.exports = (nombreComision) => {
    const router = express.Router();
    const controller = controladorComision(nombreComision);

    // Middleware de diagnóstico para ver si la petición entra a esta ruta
    router.use((req, res, next) => {
        console.log(`[PLAN TRABAJO LOG] 📥 Petición ${req.method} recibida para comisión: "${nombreComision}" en endpoint: ${req.originalUrl}`);
        next();
    });

    router.get('/', controller.obtenerPlanes);
    router.post('/', controller.crearPlan);
    router.put('/:id', controller.actualizarPlan);
    router.delete('/:id', controller.eliminarPlan);

    return router;
};