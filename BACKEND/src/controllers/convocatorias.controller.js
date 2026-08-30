const CoelConvocatoria = require('../models/CoelConvocatorias');

const obtenerConvocatorias = async (req, res) => {
    try {
        const data = await CoelConvocatoria.find().sort({ createdAt: -1 });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: error.message });
    }
};

const crearConvocatoria = async (req, res) => {
    try {
        const { titulo, descripcion, nombreArchivo, archivoBase64 } = req.body;

        const nueva = new CoelConvocatoria({
            titulo,
            descripcion,
            nombreArchivo,
            archivoBase64,
        });

        const data = await nueva.save();
        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: error.message });
    }
};

const actualizarConvocatoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, nombreArchivo, archivoBase64 } = req.body;

        const updateData = { titulo, descripcion };
        if (archivoBase64 && nombreArchivo) {
            updateData.archivoBase64 = archivoBase64;
            updateData.nombreArchivo = nombreArchivo;
        }

        const data = await CoelConvocatoria.findByIdAndUpdate(id, updateData, { new: true });
        if (!data) {
            return res.status(404).json({ success: false, mensaje: "Convocatoria no encontrada" });
        }

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: error.message });
    }
};

const eliminarConvocatoria = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await CoelConvocatoria.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({ success: false, mensaje: "Convocatoria no encontrada" });
        }

        res.json({ success: true, mensaje: "Eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: error.message });
    }
};

module.exports = {
    obtenerConvocatorias,
    crearConvocatoria,
    actualizarConvocatoria,
    eliminarConvocatoria,
};