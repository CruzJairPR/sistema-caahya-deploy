const mongoose = require("mongoose");

const ComisionDictaminadoraSchema = new mongoose.Schema({
    Entidad: {
        type: String,
        trim: true,
        default: null
    },
    Comision: {
        type: String,
        trim: true,
        default: null
    },
    "Fuente de Designacion": {
        type: String,
        trim: true,
        default: null
    },
    Miembro: {
        type: String,
        trim: true,
        default: null
    },
    Adscripcion: {
        type: String,
        trim: true,
        default: null
    },
    "Categoria y nivel": {
        type: String,
        default: null,
        trim: true
    },
    Periodo: {
        type: String,
        trim: true,
        default: null
    },
    Inicio: {
        type: Date,
        default: null
    },
    Termino: {
        type: Date,
        default: null
    },
    Permanencia: {
        type: String,
        trim: true,
        default: null
    },
    Observaciones: {
        type: String,
        trim: true,
        default: null
    },
    "Prefencias de areas CAAHyA": {
        type: String,
        trim: true,
        default: null
    },
    "Ultima modificacion a la base": {
        type: Date,
        default: null
    },
    "Miembro anterior": {
        type: String,
        trim: true,
        default: null
    },
    pestanaOrigen: {
        type: String,
        trim: true,
        default: null
    },
    urgencia: {
        type: String,
        trim: true,
        default: null
    }
}, {
    timestamps: true,
    collection: "comisiones_dictaminadoras"
});

module.exports = mongoose.model("ComisionDictaminadora", ComisionDictaminadoraSchema);