const mongoose = require("mongoose");

const sesionesRevisadoraSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        descripcion: { type: String, required: true, trim: true },
        nombreArchivo: { type: String, required: true },
        archivoBase64: { type: String, required: true },
        tipo: { type: String, required: true, default: "sesion" },
    },
    { timestamps: true } // crea createdAt y updatedAt automáticamente
);

module.exports =
    mongoose.models.SesionesRevisadora ||
    mongoose.model("Sesiones_Revisadora", sesionesRevisadoraSchema);