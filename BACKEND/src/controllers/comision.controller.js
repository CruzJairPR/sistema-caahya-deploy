const ComisionDictaminadora = require("../models/secretaria-aux1/ComisionDictaminadora");

exports.obtenerComisiones = async (req, res) => {
    try {
        const comisiones = await ComisionDictaminadora.find();
        res.status(200).json(comisiones);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// CREATE
exports.crearComision = async (req, res) => {
    try {
        const nuevaComision = await ComisionDictaminadora.create(req.body);
        res.status(201).json({ success: true, data: nuevaComision });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// UPDATE
exports.actualizarComision = async (req, res) => {
    try {
        const comisionActualizada = await ComisionDictaminadora.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!comisionActualizada) {
            return res.status(404).json({ success: false, error: "Comisión no encontrada." });
        }
        res.status(200).json({ success: true, data: comisionActualizada });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// DELETE
exports.eliminarComision = async (req, res) => {
    try {
        const comisionEliminada = await ComisionDictaminadora.findByIdAndDelete(req.params.id);
        if (!comisionEliminada) {
            return res.status(404).json({ success: false, error: "Comisión no encontrada." });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};