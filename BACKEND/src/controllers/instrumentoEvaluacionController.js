const InstrumentoEvaluacion = require("../models/InstrumentoEvaluacion");

exports.obtenerInstrumentos = async (req, res) => {
    try {
        const instrumentos = await InstrumentoEvaluacion.find().sort({ fechaSubida: -1 });
        res.json(instrumentos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los instrumentos", error: error.message });
    }
};

exports.crearInstrumento = async (req, res) => {
    try {
        const { titulo, descripcion, nombreArchivo, archivoBase64 } = req.body;

        if (!titulo || !descripcion || !nombreArchivo || !archivoBase64) {
            return res.status(400).json({ mensaje: "Faltan campos requeridos" });
        }

        const nuevoInstrumento = new InstrumentoEvaluacion({
            titulo,
            descripcion,
            nombreArchivo,
            archivoBase64,
        });

        await nuevoInstrumento.save();
        res.status(201).json(nuevoInstrumento);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el instrumento", error: error.message });
    }
};

exports.eliminarInstrumento = async (req, res) => {
    try {
        const eliminado = await InstrumentoEvaluacion.findByIdAndDelete(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: "Instrumento no encontrado" });
        }
        res.json({ mensaje: "Instrumento eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el instrumento", error: error.message });
    }
};