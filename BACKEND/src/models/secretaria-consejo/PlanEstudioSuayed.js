const mongoose = require("mongoose");

const PlanEstudioSuayedSchema = new mongoose.Schema({
    licenciatura: {
        type: String,
        trim: true,
        default: ""
    },
    entidad: {
        type: String,
        trim: true,
        default: ""
    },
    creacion_implantacion: {
        type: Number,
        default: null
    },
    modificacion: {
        type: Number,
        default: null
    },
    evaluacion: {
        type: Number,
        default: null
    },
    adecuacion_temas_emergentes: {
        type: String,
        default: null
    },
    adecuacion_titulacion: {
        type: String,
        default: null
    }
}, { timestamps: true, collection: "planes_estudio_suayed" });

module.exports = mongoose.model("PlanEstudioSuayed", PlanEstudioSuayedSchema, "planEstudioSuayed");