const Miembro = require('../models/Miembro');

// Obtener todos los miembros
exports.obtenerMiembros = async (req, res) => {
    try {
        const miembros = await Miembro.find();
        res.status(200).json(miembros);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los miembros', error });
    }
};

// Crear un nuevo miembro
exports.crearMiembro = async (req, res) => {
    try {
        const nuevoMiembro = new Miembro(req.body);
        await nuevoMiembro.save();
        res.status(201).json(nuevoMiembro);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear miembro', error });
    }
};

// Actualizar un miembro
exports.actualizarMiembro = async (req, res) => {
    try {
        const { id } = req.params;
        const miembroActualizado = await Miembro.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!miembroActualizado) {
            return res.status(404).json({ mensaje: 'Miembro no encontrado' });
        }

        res.status(200).json(miembroActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar miembro', error });
    }
};

// Eliminar un miembro
exports.eliminarMiembro = async (req, res) => {
    try {
        const { id } = req.params;
        const miembroEliminado = await Miembro.findByIdAndDelete(id);

        if (!miembroEliminado) {
            return res.status(404).json({ mensaje: 'Miembro no encontrado' });
        }

        res.status(200).json({ mensaje: 'Miembro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar miembro', error });
    }
};