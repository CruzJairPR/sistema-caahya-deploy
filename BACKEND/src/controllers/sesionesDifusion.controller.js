const SesionesDifusion = require("../models/SesionesDifusion");

// Obtener todas las sesiones de difusión
const obtenerSesiones = async (req, res) => {
    try {
        const sesiones = await SesionesDifusion.find().sort({ createdAt: -1 });
        res.status(200).json(sesiones);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las sesiones", error: error.message });
    }
};

// Crear una nueva sesión con archivo Base64
const crearSesion = async (req, res) => {
    try {
        const { titulo, descripcion, comentarios, fechaArchivo, nombreArchivo, archivoBase64, tipo } = req.body;

        if (!titulo || !descripcion || !nombreArchivo || !archivoBase64) {
            return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
        }

        const nuevaSesion = new SesionesDifusion({
            titulo,
            descripcion,
            comentarios: comentarios || "",
            fechaArchivo: fechaArchivo ? fechaArchivo : undefined,
            nombreArchivo,
            archivoBase64,
            tipo: tipo || "sesion",
        });

        const sesionGuardada = await nuevaSesion.save();
        res.status(201).json(sesionGuardada);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar la sesión", error: error.message });
    }
};

// Actualizar una sesión existente
const actualizarSesion = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, comentarios, fechaArchivo, nombreArchivo, archivoBase64, tipo } = req.body;

        const datosActualizados = {
            titulo,
            descripcion,
            comentarios: comentarios || "",
            fechaArchivo: fechaArchivo ? fechaArchivo : undefined,
            tipo,
        };

        // Solo actualizamos los campos del archivo si el usuario subió uno nuevo
        if (nombreArchivo && archivoBase64) {
            datosActualizados.nombreArchivo = nombreArchivo;
            datosActualizados.archivoBase64 = archivoBase64;
        }

        const sesionActualizada = await SesionesDifusion.findByIdAndUpdate(
            id,
            datosActualizados,
            { new: true, runValidators: true }
        );

        if (!sesionActualizada) {
            return res.status(404).json({ mensaje: "Sesión no encontrada" });
        }

        res.status(200).json(sesionActualizada);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la sesión", error: error.message });
    }
};

// Eliminar una sesión
const eliminarSesion = async (req, res) => {
    try {
        const { id } = req.params;
        const sesionEliminada = await SesionesDifusion.findByIdAndDelete(id);

        if (!sesionEliminada) {
            return res.status(404).json({ mensaje: "Sesión no encontrada" });
        }

        res.status(200).json({ mensaje: "Sesión eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la sesión", error: error.message });
    }
};

module.exports = {
    obtenerSesiones,
    crearSesion,
    actualizarSesion,
    eliminarSesion,
};