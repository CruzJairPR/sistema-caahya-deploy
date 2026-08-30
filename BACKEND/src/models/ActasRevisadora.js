const mongoose = require("mongoose");

const actasRevisadoraSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        descripcion: { type: String, required: true, trim: true },
        nombreArchivo: { type: String, required: true },
        archivoBase64: { type: String, required: true },
        tipo: { type: String, required: true, default: "acta" },
    },
    { timestamps: true } // Crea createdAt y updatedAt automáticamente
);

module.exports =
    mongoose.models.ActasRevisadora ||
    mongoose.model("Actas_Revisadora", actasRevisadoraSchema);