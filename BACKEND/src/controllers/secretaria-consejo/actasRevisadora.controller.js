const ActaRevisadora = require("../../models/secretaria-consejo/ActasRevisadora");

const obtenerActasRevisadora = async (req, res) => {
    try {
        const actas = await ActaRevisadora.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: actas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const crearActaRevisadora = async (req, res) => {
    try {
        const { titulo, descripcion, nombreArchivo, archivoBase64 } = req.body;
        const nuevaActa = new ActaRevisadora({ titulo, descripcion, nombreArchivo, archivoBase64 });
        const guardada = await nuevaActa.save();
        res.status(201).json({ success: true, data: guardada });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const actualizarActaRevisadora = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizada = await ActaRevisadora.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, data: actualizada });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const eliminarActaRevisadora = async (req, res) => {
    try {
        const { id } = req.params;
        await ActaRevisadora.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    obtenerActasRevisadora,
    crearActaRevisadora,
    actualizarActaRevisadora,
    eliminarActaRevisadora,
};