const mongoose = require("mongoose");

const recursoRevisionPrimerPeriodoSchema = new mongoose.Schema(
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
            default: "recurso_revision_primer_periodo"
        },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.RecursoRevisionPrimerPeriodo ||
    mongoose.model("Recurso_Revision_Primer_Periodo", recursoRevisionPrimerPeriodoSchema);