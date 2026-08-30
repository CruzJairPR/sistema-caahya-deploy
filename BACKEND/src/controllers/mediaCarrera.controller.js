const MediaCarrera = require('../models/MediaCarrera');

// Obtener sesiones o planes de una carrera específica
exports.obtenerPorTipoYCarrera = async (req, res) => {
    try {
        const { carrera, tipo } = req.params; // 'tipo' será 'sesiones' o 'plan-trabajo'
        const datos = await MediaCarrera.find({ carreraId: carrera, tipoArchivo: tipo });
        res.json(datos);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Crear una sesión o plan de trabajo
exports.crearMedia = async (req, res) => {
    try {
        const { carrera, tipo } = req.params;
        const nuevoDato = new MediaCarrera({
            ...req.body,
            carreraId: carrera,
            tipoArchivo: tipo
        });
        const guardado = await nuevoDato.save();
        res.status(201).json(guardado);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Actualizar sesión o plan de trabajo
exports.actualizarMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await MediaCarrera.findByIdAndUpdate(id, req.body, { new: true });
        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Eliminar sesión o plan de trabajo
exports.eliminarMedia = async (req, res) => {
    try {
        const { id } = req.params;
        await MediaCarrera.findByIdAndDelete(id);
        res.json({ success: true, mensaje: "Eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};