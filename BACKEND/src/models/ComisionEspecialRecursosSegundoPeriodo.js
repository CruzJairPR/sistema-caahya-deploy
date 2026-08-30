const mongoose = require("mongoose");

const comisionEspecialRecursosSegundoPeriodoSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        descripcion: { type: String, required: true, trim: true },
        nombreArchivo: { type: String, required: true },
        archivoBase64: { type: String, required: true },
        tipo: { type: String, required: true, default: "comisionEspecialRecursosSegundoPeriodo" },
    },
    { timestamps: true }
);

module.exports = mongoose.models.ComisionEspecialRecursosSegundoPeriodo || mongoose.model("ComisionEspecialRecursosSegundoPeriodo", comisionEspecialRecursosSegundoPeriodoSchema);