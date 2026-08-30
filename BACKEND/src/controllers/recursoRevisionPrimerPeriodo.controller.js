const RecursoRevisionPrimerPeriodo = require("../models/RecursoRevisionPrimerPeriodo");

const obtenerRecursos = async (req, res) => {
    try {
        const recursos = await RecursoRevisionPrimerPeriodo.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: recursos });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const crearRecurso = async (req, res) => {
    try {
        const { titulo, descripcion, nombreArchivo, archivoBase64 } = req.body;
        const nuevoRecurso = new RecursoRevisionPrimerPeriodo({
            titulo,
            descripcion,
            nombreArchivo,
            archivoBase64,
        });
        const guardado = await nuevoRecurso.save();
        res.status(201).json({ success: true, data: guardado });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const actualizarRecurso = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await RecursoRevisionPrimerPeriodo.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, data: actualizado });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const eliminarRecurso = async (req, res) => {
    try {
        const { id } = req.params;
        await RecursoRevisionPrimerPeriodo.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    obtenerRecursos,
    crearRecurso,
    actualizarRecurso,
    eliminarRecurso,
};