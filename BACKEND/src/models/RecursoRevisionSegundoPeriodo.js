const mongoose = require("mongoose");

const recursoRevisionSegundoPeriodoSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        descripcion: { type: String, required: true, trim: true },
        nombreArchivo: { type: String, required: true },
        archivoBase64: { type: String, required: true },
        tipo: { type: String, required: true, default: "recurso_revision_segundo_periodo" },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.RecursoRevisionSegundoPeriodo ||
    mongoose.model("Recurso_Revision_Segundo_Periodo", recursoRevisionSegundoPeriodoSchema);