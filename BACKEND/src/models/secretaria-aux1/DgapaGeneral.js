const mongoose = require('mongoose');

const Dgapa_GeneralSchema = new mongoose.Schema(
    {
        numero: { type: Number },
        urgencia: { type: String, trim: true, default: null },
        Entidad: { type: String, trim: true, default: null },
        Comision: { type: String, trim: true, default: null },
        "Fuente de Designacion": { type: String, trim: true, default: null },
        Miembro: { type: String, trim: true, default: null },
        "Categoria y nivel": { type: String, trim: true, default: null },
        Adscripcion: { type: String, trim: true, default: null },
        Area: { type: String, trim: true, default: null },
        Periodo: { type: String, trim: true, default: null },
        Inicio: { type: Date, default: null },
        Termino: { type: Date, default: null },
        PRIDE: { type: String, trim: true, default: null },
        Mail: { type: String, trim: true, default: null },
        Disciplina: { type: String, trim: true, default: null },
        Especialidad: { type: String, trim: true, default: null },
        "Ultima modificacion a la base": { type: Date, default: null },
        "Miembro anterior": { type: String, trim: true, default: null },
        pestanaOrigen: { type: String, required: true, index: true }
    },
    {
        timestamps: true,
        collection: 'dgapa_general'
    }
);

module.exports = mongoose.model('Dgapa_General', Dgapa_GeneralSchema);