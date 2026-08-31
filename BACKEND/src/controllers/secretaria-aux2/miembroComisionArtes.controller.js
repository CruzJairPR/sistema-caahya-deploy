const MiembroComisionArtes = require('../../models/secretaria-aux2/MiembroComisionArtes');

/**
 * @desc    Obtener todos los miembros
 * @route   GET /api/v1/miembros
 */
const obtenerMiembroComisionArtes = async (req, res) => {
    try {
        const registros = await MiembroComisionArtes.find({});
        res.status(200).json({ success: true, count: registros.length, data: registros });
    } catch (error) {
        console.error('❌ Error en obtenerMiembroComisionArtes:', error.message);
        res.status(500).json({ success: false, error: 'Error al obtener los miembros' });
    }
};

/**
 * @desc    Crear un nuevo miembro (Botón Agregar)
 * @route   POST /api/v1/miembros
 */
const crearMiembroComisionArtes = async (req, res) => {
    try {
        const nuevoRegistro = await MiembroComisionArtes.create(req.body);
        res.status(201).json({ success: true, data: nuevoRegistro });
    } catch (error) {
        console.error('❌ Error en crearMiembroComisionArtes:', error.message);
        res.status(400).json({ success: false, error: error.message || 'Error al guardar el miembro' });
    }
};

/**
 * @desc    Actualizar un miembro existente (Botón Editar)
 * @route   PUT /api/v1/miembros/:id
 */
const actualizarMiembroComisionArtes = async (req, res) => {
    try {
        const registroActualizado = await MiembroComisionArtes.findByIdAndUpdate(
            req.params.id, // El _id que manda el Front
            req.body,      // Los nuevos datos editados (ahora soporta campos opcionales)
            { new: true, runValidators: true } // Devuelve el dato ya cambiado
        );

        if (!registroActualizado) {
            return res.status(404).json({ success: false, error: 'Miembro no encontrado' });
        }

        res.status(200).json({ success: true, data: registroActualizado });
    } catch (error) {
        console.error('❌ Error en actualizarMiembroComisionArtes:', error.message);
        res.status(400).json({ success: false, error: error.message || 'Error al actualizar el miembro' });
    }
};

/**
 * @desc    Eliminar un miembro
 * @route   DELETE /api/v1/miembros/:id
 */
const eliminarMiembroComisionArtes = async (req, res) => {
    try {
        const registroEliminado = await MiembroComisionArtes.findByIdAndDelete(req.params.id);

        if (!registroEliminado) {
            return res.status(404).json({ success: false, error: 'Miembro no encontrado' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('❌ Error en eliminarMiembroComisionArtes:', error.message);
        res.status(500).json({ success: false, error: 'Error al eliminar el miembro' });
    }
};

module.exports = {
    obtenerMiembroComisionArtes,
    crearMiembroComisionArtes,
    actualizarMiembroComisionArtes,
    eliminarMiembroComisionArtes
};