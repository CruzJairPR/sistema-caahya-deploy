// models/PlanEstudioSuayed.js
const mongoose = require("mongoose");

const PlanEstudioSuayedSchema = new mongoose.Schema({
    licenciatura: {
        type: String,
        required: [true, "La licenciatura es obligatoria."],
        trim: true
    },
    entidad: {
        type: String,
        required: [true, "La entidad universitaria es obligatoria."],
        trim: true
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
}, { timestamps: true, collection: "planes_estudio_suayed" }); // Forzamos el nombre de la colección

module.exports = mongoose.model("PlanEstudioSuayed", PlanEstudioSuayedSchema, "planEstudioSuayed");