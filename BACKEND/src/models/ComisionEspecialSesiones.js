const mongoose = require("mongoose");

const comisionEspecialSesionesSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        descripcion: { type: String, required: true, trim: true },
        nombreArchivo: { type: String, required: true },
        archivoBase64: { type: String, required: true },
        tipo: { type: String, required: true, default: "comisionEspecialSesiones" },
    },
    { timestamps: true }
);

module.exports = mongoose.models.ComisionEspecialSesiones || mongoose.model("ComisionEspecialSesiones", comisionEspecialSesionesSchema);