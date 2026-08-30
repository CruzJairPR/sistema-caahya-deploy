const mongoose = require("mongoose");

const EvaluadoraPrideSchema = new mongoose.Schema(
    {
        Número: { type: Number },
        Entidad: { type: String },
        "Fuente de Designación": { type: String },
        "Tipo de Miembro": { type: String },
        Miembro: { type: String },
        Adscripción: { type: String },
        "Categoría y nivel": { type: String },
        Periodo: { type: String },
        Inicio: { type: Date },
        Término: { type: Date },
        Permanencia: { type: String },
        Observaciones: { type: String },
        "Prefencias de áreas CAAHyA": { type: String, default: null },
        "Última modificación a la base": { type: Date },
        "Miembro anterior": { type: String },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "evaluadorasPride"
    }
);

module.exports = mongoose.model("EvaluadoraPride", EvaluadoraPrideSchema);