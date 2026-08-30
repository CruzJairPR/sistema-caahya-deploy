const mongoose = require("mongoose");

const sesionesDifusionSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        descripcion: { type: String, required: true, trim: true },
        comentarios: { type: String, default: "" }, // <-- Agregado
        fechaArchivo: { type: String },              // <-- Agregado
        nombreArchivo: { type: String, required: true },
        archivoBase64: { type: String, required: true },
        tipo: { type: String, required: true, default: "sesion" },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.SesionesDifusion ||
    mongoose.model("Sesiones_Difusion", sesionesDifusionSchema, "sesiones_difusion");