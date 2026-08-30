const Arquitectura = require("../models/Arquitectura");

// READ: GET /api/v1/arquitectura
exports.obtenerArquitectura = async (req, res) => {
    try {
        const arquitecturas = await Arquitectura.find().sort({ nombre: 1 });
        res.status(200).json({ success: true, data: arquitecturas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// CREATE: POST /api/v1/arquitectura
exports.crearArquitectura = async (req, res) => {
    try {
        const nuevaArquitectura = await Arquitectura.create(req.body);
        res.status(201).json({ success: true, data: nuevaArquitectura });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// UPDATE: PUT /api/v1/arquitectura/:id
exports.actualizarArquitectura = async (req, res) => {
    try {
        const arquitecturaActualizada = await Arquitectura.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!arquitecturaActualizada) {
            return res.status(404).json({ success: false, error: "Registro no encontrado" });
        }

        res.status(200).json({ success: true, data: arquitecturaActualizada });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// DELETE: DELETE /api/v1/arquitectura/:id
exports.eliminarArquitectura = async (req, res) => {
    try {
        const arquitecturaEliminada = await Arquitectura.findByIdAndDelete(req.params.id);

        if (!arquitecturaEliminada) {
            return res.status(404).json({ success: false, error: "Registro no encontrado" });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};