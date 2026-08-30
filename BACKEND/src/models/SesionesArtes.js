const mongoose = require("mongoose");

// 1. Declarar el esquema con el nombre exacto
const sesionesArtesSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true },
        descripcion: { type: String, default: "" },
        comentarios: { type: String, default: "" },
        fechaArchivo: { type: String }, // o Date, dependiendo de cómo prefieras guardarlo
        nombreArchivo: { type: String, required: true },
        archivoBase64: { type: String, required: true },
        tipo: { type: String, default: "sesion" },
    },
    {
        timestamps: true, // Esto genera automáticamente createdAt y updatedAt
    }
);

// 2. Registrar y exportar el modelo usando esa variable
module.exports = mongoose.model("Sesiones_Artes", sesionesArtesSchema, "sesiones_artes");