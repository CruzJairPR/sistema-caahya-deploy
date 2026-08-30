const ComisionEspecialActas = require("../models/ComisionEspecialActas");

const obtener = async (req, res) => {
    try {
        const data = await ComisionEspecialActas.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const crear = async (req, res) => {
    try {
        const { titulo, descripcion, nombreArchivo, archivoBase64 } = req.body;
        const nuevo = new ComisionEspecialActas({ titulo, descripcion, nombreArchivo, archivoBase64 });
        const guardado = await nuevo.save();
        res.status(201).json({ success: true, data: guardado });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await ComisionEspecialActas.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, data: actualizado });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        await ComisionEspecialActas.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { obtener, crear, actualizar, eliminar };