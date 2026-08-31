const mongoose = require("mongoose");

const recursoRevisionSegundoPeriodoSchema = new mongoose.Schema(
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
            required: true,
            default: "recurso_revision_segundo_periodo"
        },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.RecursoRevisionSegundoPeriodo ||
    mongoose.model("Recurso_Revision_Segundo_Periodo", recursoRevisionSegundoPeriodoSchema);