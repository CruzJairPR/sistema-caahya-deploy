const mongoose = require("mongoose");

const comisionEspecialActasSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, "El título es obligatorio."],
            trim: true
        },
        descripcion: {
            type: String,
            default: ""
        },
        comentarios: {
            type: String,
            default: ""
        },
        fechaArchivo: {
            type: String,
            default: ""
        },
        nombreArchivo: {
            type: String,
            required: [true, "El archivo es obligatorio."]
        },
        archivoBase64: {
            type: String,
            required: [true, "El archivo es obligatorio."]
        },
        tipo: {
            type: String,
            default: "comisionEspecialActas"
        },
    },
    { timestamps: true }
);

module.exports = mongoose.models.ComisionEspecialActas || mongoose.model("ComisionEspecialActas", comisionEspecialActasSchema);