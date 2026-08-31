const SesionesArtes = require("../../models/secretaria-aux2/SesionesArtes");

// Obtener todas las sesiones de artes
const obtenerSesionesArtes = async (req, res) => {
    try {
        const sesiones = await SesionesArtes.find().sort({ createdAt: -1 });
        res.status(200).json(sesiones);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las sesiones de artes", error: error.message });
    }
};

// Crear una nueva sesión
const crearSesionArtes = async (req, res) => {
    try {
        const { titulo, descripcion, comentarios, fechaArchivo, nombreArchivo, archivoBase64, tipo } = req.body;

        // Solo exigimos lo estrictamente obligatorio
        if (!titulo || !nombreArchivo || !archivoBase64) {
            return res.status(400).json({ mensaje: "El título y el archivo son obligatorios" });
        }

        const nuevaSesion = new SesionesArtes({
            titulo,
            descripcion: descripcion || "",
            comentarios: comentarios || "",
            // Si viene fecha vacía guardamos null o undefined para que la BD no colapse
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
const actualizarSesionArtes = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, comentarios, fechaArchivo, nombreArchivo, archivoBase64, tipo } = req.body;

        // CORRECCIÓN: Agregamos comentarios y fechaArchivo aquí para que se actualicen
        const datosActualizados = {
            titulo,
            descripcion: descripcion || "",
            comentarios: comentarios || "",
            fechaArchivo: fechaArchivo ? fechaArchivo : undefined,
            tipo
        };

        if (nombreArchivo && archivoBase64) {
            datosActualizados.nombreArchivo = nombreArchivo;
            datosActualizados.archivoBase64 = archivoBase64;
        }

        const sesionActualizada = await SesionesArtes.findByIdAndUpdate(
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
const eliminarSesionArtes = async (req, res) => {
    try {
        const { id } = req.params;
        const sesionEliminada = await SesionesArtes.findByIdAndDelete(id);

        if (!sesionEliminada) {
            return res.status(404).json({ mensaje: "Sesión no encontrada" });
        }

        res.status(200).json({ mensaje: "Sesión eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la sesión", error: error.message });
    }
};

module.exports = {
    obtenerSesionesArtes,
    crearSesionArtes,
    actualizarSesionArtes,
    eliminarSesionArtes,
};