// controllers/planEstudioController.js
const PlanEstudio = require("../models/PlanEstudio");

// @desc    Obtener todos los planes de estudio
// @route   GET /api/v1/planes-estudio
exports.getPlanes = async (req, res) => {
    try {
        const planes = await PlanEstudio.find().sort({ licenciatura: 1 });
        res.status(200).json({ success: true, data: planes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Crear un nuevo plan de estudio
// @route   POST /api/v1/planes-estudio
exports.createPlan = async (req, res) => {
    try {
        const nuevoPlan = await PlanEstudio.create(req.body);
        res.status(201).json({ success: true, data: nuevoPlan });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Actualizar un plan de estudio existente
// @route   PUT /api/v1/planes-estudio/:id
exports.updatePlan = async (req, res) => {
    try {
        const planActualizado = await PlanEstudio.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!planActualizado) {
            return res.status(404).json({ success: false, error: "Plan de estudio no encontrado." });
        }

        res.status(200).json({ success: true, data: planActualizado });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Eliminar un plan de estudio
// @route   DELETE /api/v1/planes-estudio/:id
exports.deletePlan = async (req, res) => {
    try {
        const planEliminado = await PlanEstudio.findByIdAndDelete(req.params.id);

        if (!planEliminado) {
            return res.status(404).json({ success: false, error: "Plan de estudio no encontrado." });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};