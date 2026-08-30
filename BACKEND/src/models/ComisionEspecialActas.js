const mongoose = require("mongoose");

const comisionEspecialActasSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        descripcion: { type: String, required: true, trim: true },
        nombreArchivo: { type: String, required: true },
        archivoBase64: { type: String, required: true },
        tipo: { type: String, required: true, default: "comisionEspecialActas" },
    },
    { timestamps: true }
);

module.exports = mongoose.models.ComisionEspecialActas || mongoose.model("ComisionEspecialActas", comisionEspecialActasSchema);