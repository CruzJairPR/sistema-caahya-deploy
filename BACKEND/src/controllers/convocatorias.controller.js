const CoelConvocatoria = require('../models/secretaria-aux2/CoelConvocatorias');

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
        // 1. Extraemos comentarios y fechaArchivo del body
        const { titulo, descripcion, comentarios, fechaArchivo, nombreArchivo, archivoBase64 } = req.body;

        const nueva = new CoelConvocatoria({
            titulo,
            descripcion,
            comentarios,    // 👈 Agregado aquí
            fechaArchivo,   // 👈 Agregado aquí
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
        // 2. Extraemos comentarios y fechaArchivo en la actualización
        const { titulo, descripcion, comentarios, fechaArchivo, nombreArchivo, archivoBase64 } = req.body;

        // 3. Los incluimos en el objeto que se va a actualizar
        const updateData = {
            titulo,
            descripcion,
            comentarios,
            fechaArchivo
        };

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