const mongoose = require("mongoose");

const sesionesArtesSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true },
        descripcion: { type: String, default: "" },
        comentarios: { type: String, default: "" },
        fechaArchivo: { type: String },
        nombreArchivo: { type: String, required: true },
        archivoBase64: { type: String, required: true },
        tipo: { type: String, default: "sesion" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Sesiones_Artes", sesionesArtesSchema, "sesiones_artes");