const mongoose = require("mongoose");

const instrumentoEvaluacionSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true },
        descripcion: { type: String, required: true },
        nombreArchivo: { type: String, required: true },
        archivoBase64: { type: String, required: true }, // data URI completo: "data:application/pdf;base64,..."
        fechaSubida: { type: Date, default: Date.now },
    },
    { collection: "instrumentos_evaluacion" }
);

module.exports = mongoose.model("InstrumentoEvaluacion", instrumentoEvaluacionSchema);