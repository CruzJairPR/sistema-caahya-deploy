const Directorio = require('../models/secretaria-aux1/Directorio');

// Obtener todos
const obtenerDirectorios = async (req, res) => {
    try {
        const entidades = await Directorio.find();
        res.status(200).json({ success: true, count: entidades.length, data: entidades });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener datos' });
    }
};

// Crear
const crearDirectorio = async (req, res) => {
    try {
        const nuevoDirectorio = await Directorio.create(req.body);
        res.status(201).json({ success: true, data: nuevoDirectorio });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Actualizar
const actualizarDirectorio = async (req, res) => {
    try {
        const { id } = req.params;
        const directorioActualizado = await Directorio.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!directorioActualizado) return res.status(404).json({ success: false, error: 'No encontrado' });
        res.status(200).json({ success: true, data: directorioActualizado });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Eliminar
const eliminarDirectorio = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Directorio.findByIdAndDelete(id);
        if (!eliminado) return res.status(404).json({ success: false, error: 'No encontrado' });
        res.status(200).json({ success: true, message: 'Eliminado con éxito' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = {
    obtenerDirectorios,
    crearDirectorio,
    actualizarDirectorio,
    eliminarDirectorio
};