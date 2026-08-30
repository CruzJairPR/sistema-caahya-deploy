const EvaluadoraPride = require("../models/EvaluadorasPride");

// Obtener todos los registros (con límite opcional)
const obtenerEvaluadoras = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 200;
        const data = await EvaluadoraPride.find().limit(limit);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Crear un nuevo registro
const crearEvaluadora = async (req, res) => {
    try {
        const nuevaEvaluadora = new EvaluadoraPride(req.body);
        const data = await nuevaEvaluadora.save();
        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Actualizar un registro
const actualizarEvaluadora = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await EvaluadoraPride.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!data) {
            return res.status(404).json({ success: false, message: "Registro no encontrado" });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Eliminar un registro
const eliminarEvaluadora = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await EvaluadoraPride.findByIdAndDelete(id);
        if (!data) {
            return res.status(404).json({ success: false, message: "Registro no encontrado" });
        }
        res.status(200).json({ success: true, message: "Eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    obtenerEvaluadoras,
    crearEvaluadora,
    actualizarEvaluadora,
    eliminarEvaluadora,
};