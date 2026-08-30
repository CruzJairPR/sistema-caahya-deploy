const mongoose = require("mongoose");

const recursoRevisionPrimerPeriodoSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        descripcion: { type: String, required: true, trim: true },
        nombreArchivo: { type: String, required: true },
        archivoBase64: { type: String, required: true },
        tipo: { type: String, required: true, default: "recurso_revision_primer_periodo" },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.RecursoRevisionPrimerPeriodo ||
    mongoose.model("Recurso_Revision_Primer_Periodo", recursoRevisionPrimerPeriodoSchema);