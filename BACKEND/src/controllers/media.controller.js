const Media = require("../models/Media");

const MIMES_PERMITIDOS = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

exports.subirMedia = async (req, res) => {
    try {
        const { titulo, descripcion, nombreArchivo, archivoBase64, tipoFormato } = req.body;
        if (!titulo || !descripcion || !nombreArchivo || !archivoBase64) {
            return res.status(400).json({ mensaje: "Faltan campos obligatorios." });
        }

        const matches = archivoBase64.match(/^data:(.*);base64,/);
        if (!matches || matches.length < 2) {
            return res.status(400).json({ mensaje: "Formato Base64 inválido." });
        }

        if (!MIMES_PERMITIDOS.includes(matches[1])) {
            return res.status(400).json({ mensaje: "Solo se permite Word, Excel o PDF." });
        }

        const nuevoArchivo = new Media({ titulo, descripcion, nombreArchivo, archivoBase64, tipoFormato });
        await nuevoArchivo.save();
        res.status(201).json(nuevoArchivo);
    } catch (error) {
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
};

exports.actualizarMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, nombreArchivo, archivoBase64 } = req.body;

        if (!titulo || !descripcion) {
            return res.status(400).json({ mensaje: "El título y la descripción son obligatorios." });
        }

        const datosActualizados = { titulo, descripcion };

        // Si se seleccionó un archivo nuevo durante la edición, se valida y se incluye
        if (archivoBase64 && nombreArchivo) {
            const matches = archivoBase64.match(/^data:(.*);base64,/);
            if (!matches || matches.length < 2) {
                return res.status(400).json({ mensaje: "Formato Base64 inválido." });
            }

            if (!MIMES_PERMITIDOS.includes(matches[1])) {
                return res.status(400).json({ mensaje: "Solo se permite Word, Excel o PDF." });
            }

            datosActualizados.archivoBase64 = archivoBase64;
            datosActualizados.nombreArchivo = nombreArchivo;
        }

        const archivoActualizado = await Media.findByIdAndUpdate(
            id,
            datosActualizados,
            { new: true } // Retorna el documento actualizado
        );

        if (!archivoActualizado) {
            return res.status(404).json({ mensaje: "No existe el archivo." });
        }

        res.status(200).json(archivoActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el archivo." });
    }
};

exports.obtenerMedia = async (req, res) => {
    try {
        const archivos = await Media.find().sort({ fechaSubida: -1 });
        res.status(200).json(archivos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener archivos." });
    }
};

exports.eliminarMedia = async (req, res) => {
    try {
        const archivoEliminado = await Media.findByIdAndDelete(req.params.id);
        if (!archivoEliminado) return res.status(404).json({ mensaje: "No existe." });
        res.status(200).json({ mensaje: "Eliminado con éxito." });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar." });
    }
};