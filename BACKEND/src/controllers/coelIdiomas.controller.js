const CoelIdiomas = require('../models/CoelIdiomas');

// Obtener todos los registros filtrados por idioma y tipo de examen
const obtenerCoelIdiomas = async (req, res) => {
    try {
        const { idioma, tipo } = req.params;
        const registros = await CoelIdiomas.find({ idioma, tipoExamen: tipo }).sort({ createdAt: -1 });
        res.json(registros);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los registros', error: error.message });
    }
};

// Crear un nuevo registro
const crearCoelIdioma = async (req, res) => {
    try {
        const { idioma, tipo } = req.params;
        const { titulo, descripcion, nombreArchivo, archivoBase64 } = req.body;

        const nuevoRegistro = new CoelIdiomas({
            titulo,
            descripcion,
            nombreArchivo,
            archivoBase64,
            idioma,
            tipoExamen: tipo
        });

        await nuevoRegistro.save();
        res.status(201).json({ mensaje: 'Registro guardado con éxito', data: nuevoRegistro });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al guardar el registro', error: error.message });
    }
};

// Actualizar un registro existente por su ID
const actualizarCoelIdioma = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, nombreArchivo, archivoBase64 } = req.body;

        const datosActualizados = { titulo, descripcion };
        if (nombreArchivo) datosActualizados.nombreArchivo = nombreArchivo;
        if (archivoBase64) datosActualizados.archivoBase64 = archivoBase64;

        const registroActualizado = await CoelIdiomas.findByIdAndUpdate(id, datosActualizados, { new: true });

        if (!registroActualizado) {
            return res.status(404).json({ mensaje: 'Registro no encontrado' });
        }

        res.json({ mensaje: 'Registro actualizado con éxito', data: registroActualizado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar', error: error.message });
    }
};

// Eliminar un registro por su ID
const eliminarCoelIdioma = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await CoelIdiomas.findByIdAndDelete(id);

        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Registro no encontrado' });
        }

        res.json({ mensaje: 'Registro eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar', error: error.message });
    }
};

module.exports = {
    obtenerCoelIdiomas,
    crearCoelIdioma,
    actualizarCoelIdioma,
    eliminarCoelIdioma
};