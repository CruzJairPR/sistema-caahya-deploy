const Folios = require("../models/Folios");

exports.obtenerFolios = async (req, res) => {
    try {
        const folios = await Folios.find().sort({ fechaSubida: -1 });
        res.json(folios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los folios", error: error.message });
    }
};

exports.crearFolio = async (req, res) => {
    try {
        const { titulo, descripcion, nombreArchivo, archivoBase64 } = req.body;

        if (!titulo || !descripcion || !nombreArchivo || !archivoBase64) {
            return res.status(400).json({ mensaje: "Faltan campos requeridos" });
        }

        // CORRECCIÓN: Se usa "Folios" (en plural, tal cual se importó arriba)
        const nuevoFolio = new Folios({
            titulo,
            descripcion,
            nombreArchivo,
            archivoBase64,
        });

        await nuevoFolio.save();
        res.status(201).json(nuevoFolio);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el folio", error: error.message });
    }
};
exports.actualizarFolio = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, nombreArchivo, archivoBase64 } = req.body;

        if (!titulo || !descripcion || !nombreArchivo || !archivoBase64) {
            return res.status(400).json({ mensaje: "Faltan campos requeridos para actualizar" });
        }

        const folioActualizado = await Folios.findByIdAndUpdate(
            id,
            { titulo, descripcion, nombreArchivo, archivoBase64 },
            { new: true } // Devuelve el documento ya actualizado
        );

        if (!folioActualizado) {
            return res.status(404).json({ mensaje: "Folio no encontrado" });
        }

        res.json(folioActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el folio", error: error.message });
    }
};

exports.eliminarFolio = async (req, res) => {
    try {
        const eliminado = await Folios.findByIdAndDelete(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: "Folio no encontrado" });
        }
        res.json({ mensaje: "Folio eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el folio", error: error.message });
    }
};