const RevisionIdioma = require('../models/RevisionIdiomas');

// 1. Obtener registros filtrados por idioma y tipo de examen
const obtenerRegistros = async (req, res) => {
    try {
        const { idioma, tipo } = req.params;

        const registros = await RevisionIdioma.find({ idioma, tipoExamen: tipo });

        res.status(200).json({
            success: true,
            data: registros
        });
    } catch (error) {
        console.error("Error al obtener registros:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

// 2. Crear un nuevo registro / subir archivo
const crearRegistro = async (req, res) => {
    try {
        const { idioma, tipo } = req.params;
        const { titulo, descripcion, comentarios, fechaArchivo, nombreArchivo, archivoBase64 } = req.body;

        const nuevoRegistro = new RevisionIdioma({
            idioma,
            tipoExamen: tipo,
            titulo,
            descripcion,
            comentarios: comentarios || "",
            fechaArchivo,
            nombreArchivo,
            archivoBase64,
            fechaSubida: new Date()
        });

        await nuevoRegistro.save();

        res.status(201).json({
            success: true,
            message: "Registro creado exitosamente",
            data: nuevoRegistro
        });
    } catch (error) {
        console.error("Error al crear registro:", error);
        res.status(500).json({ success: false, message: "Error al guardar el registro" });
    }
};

// 3. Actualizar un registro existente por ID
const actualizarRegistro = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, comentarios, fechaArchivo, nombreArchivo, archivoBase64 } = req.body;

        const datosActualizados = {
            titulo,
            descripcion,
            comentarios: comentarios || "",
            fechaArchivo,
            ...(archivoBase64 && nombreArchivo && { archivoBase64, nombreArchivo })
        };

        const registroEditado = await RevisionIdioma.findByIdAndUpdate(
            id,
            datosActualizados,
            { new: true }
        );

        if (!registroEditado) {
            return res.status(404).json({ success: false, message: "Registro no encontrado" });
        }

        res.status(200).json({
            success: true,
            message: "Registro actualizado exitosamente",
            data: registroEditado
        });
    } catch (error) {
        console.error("Error al actualizar registro:", error);
        res.status(500).json({ success: false, message: "Error al actualizar el registro" });
    }
};

// 4. Eliminar un registro por ID
const eliminarRegistro = async (req, res) => {
    try {
        const { id } = req.params;

        const registroEliminado = await RevisionIdioma.findByIdAndDelete(id);

        if (!registroEliminado) {
            return res.status(404).json({ success: false, message: "Registro no encontrado" });
        }

        res.status(200).json({
            success: true,
            message: "Registro eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar registro:", error);
        res.status(500).json({ success: false, message: "Error al eliminar el registro" });
    }
};

module.exports = {
    obtenerRegistros,
    crearRegistro,
    actualizarRegistro,
    eliminarRegistro
};