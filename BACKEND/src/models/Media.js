const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    nombreArchivo: { type: String, required: true },
    archivoBase64: { type: String, required: true },
    tipoFormato: { type: String, required: true, default: "documento" },
    fechaSubida: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Media || mongoose.model("Media", MediaSchema);