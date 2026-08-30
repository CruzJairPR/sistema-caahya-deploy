const SesionesRevisadora = require("../models/SesionesRevisadora");

const obtenerSesionesRevisadora = async (req, res) => {
    try {
        const { tipo } = req.query;
        const filtro = tipo ? { tipo } : {};
        const sesiones = await SesionesRevisadora.find(filtro).sort({
            createdAt: -1,
        });
        res.status(200).json(sesiones);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener las sesiones.",
            error: error.message,
        });
    }
};

// POST /api/v1/revisadoraSesiones
const crearSesionRevisadora = async (req, res) => {
    try {
        const { titulo, descripcion, nombreArchivo, archivoBase64, tipo } =
            req.body;

        if (!titulo || !descripcion || !nombreArchivo || !archivoBase64) {
            return res.status(400).json({
                message: "Faltan campos obligatorios: título, descripción o archivo.",
            });
        }

        const nuevaSesion = await SesionesRevisadora.create({
            titulo,
            descripcion,
            nombreArchivo,
            archivoBase64,
            tipo: tipo || "sesion",
        });

        res.status(201).json(nuevaSesion);
    } catch (error) {
        res.status(500).json({
            message: "Error al crear la sesión.",
            error: error.message,
        });
    }
};

// PUT /api/v1/revisadoraSesiones/:id
const actualizarSesionRevisadora = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, nombreArchivo, archivoBase64, tipo } =
            req.body;

        const datosActualizados = {};
        if (titulo !== undefined) datosActualizados.titulo = titulo;
        if (descripcion !== undefined) datosActualizados.descripcion = descripcion;
        if (tipo !== undefined) datosActualizados.tipo = tipo;
        // El archivo es opcional al editar (reemplazo solo si se envía uno nuevo)
        if (archivoBase64) {
            datosActualizados.archivoBase64 = archivoBase64;
            if (nombreArchivo) datosActualizados.nombreArchivo = nombreArchivo;
        }

        const sesionActualizada = await SesionesRevisadora.findByIdAndUpdate(
            id,
            datosActualizados,
            { new: true, runValidators: true }
        );

        if (!sesionActualizada) {
            return res.status(404).json({ message: "Sesión no encontrada." });
        }

        res.status(200).json(sesionActualizada);
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar la sesión.",
            error: error.message,
        });
    }
};

// DELETE /api/v1/revisadoraSesiones/:id
const eliminarSesionRevisadora = async (req, res) => {
    try {
        const { id } = req.params;
        const sesionEliminada = await SesionesRevisadora.findByIdAndDelete(id);

        if (!sesionEliminada) {
            return res.status(404).json({ message: "Sesión no encontrada." });
        }

        res.status(200).json({ message: "Sesión eliminada correctamente." });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar la sesión.",
            error: error.message,
        });
    }
};

module.exports = {
    obtenerSesionesRevisadora,
    crearSesionRevisadora,
    actualizarSesionRevisadora,
    eliminarSesionRevisadora,
};