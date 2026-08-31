// models/MiembroComisionArtes.js
const mongoose = require("mongoose");

const MiembroComisionArtesSchema = new mongoose.Schema({
    rol: {
        type: String,
        trim: true
    },
    nombre: {
        type: String,
        trim: true
    },
    correo: {
        type: String,
        trim: true,
        lowercase: true
    },
    correo2: {
        type: String,
        trim: true,
        lowercase: true
    },
    telefono: {
        type: String,
        trim: true
    },
    telefono2: {
        type: String,
        trim: true
    },
    comentarios: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model(
    "MiembroComisionArtes",
    MiembroComisionArtesSchema,
    "miembrosComisionArtes"
);