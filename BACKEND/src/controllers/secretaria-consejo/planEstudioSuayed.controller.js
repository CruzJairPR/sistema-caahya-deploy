const PlanEstudioSuayed = require("../../models/secretaria-consejo/PlanEstudioSuayed");

// GET - Obtener todos los planes SUAyED
exports.getPlanesSuayed = async (req, res) => {
    try {
        const planes = await PlanEstudioSuayed.find().sort({ licenciatura: 1 });
        res.status(200).json({ success: true, data: planes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// POST - Crear un nuevo plan SUAyED
exports.createPlanSuayed = async (req, res) => {
    try {
        // Limpiamos los datos: convertimos strings vacíos "" en null
        const datosLimpios = {};
        for (const [key, value] of Object.entries(req.body)) {
            datosLimpios[key] = value === "" ? null : value;
        }

        const nuevoPlan = await PlanEstudioSuayed.create(datosLimpios);
        res.status(201).json({ success: true, data: nuevoPlan });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// PUT - Actualizar por ID (aplicamos la misma limpieza)
exports.updatePlanSuayed = async (req, res) => {
    try {
        const datosLimpios = {};
        for (const [key, value] of Object.entries(req.body)) {
            datosLimpios[key] = value === "" ? null : value;
        }

        const planActualizado = await PlanEstudioSuayed.findByIdAndUpdate(
            req.params.id,
            datosLimpios,
            { new: true, runValidators: true }
        );
        if (!planActualizado) {
            return res.status(404).json({ success: false, error: "Plan SUAyED no encontrado." });
        }
        res.status(200).json({ success: true, data: planActualizado });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// DELETE - Eliminar por ID
exports.deletePlanSuayed = async (req, res) => {
    try {
        const planEliminado = await PlanEstudioSuayed.findByIdAndDelete(req.params.id);
        if (!planEliminado) {
            return res.status(404).json({ success: false, error: "Plan SUAyED no encontrado." });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};