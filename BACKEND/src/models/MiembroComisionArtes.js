// models/MiembroComisionArtes.js
const mongoose = require("mongoose");

const MiembroComisionArtesSchema = new mongoose.Schema({
    rol: {
        type: String,
        required: [true, "El rol o entidad que representa es obligatorio."],
        trim: true
    },
    nombre: {
        type: String,
        required: [true, "El nombre del miembro es obligatorio."],
        trim: true
    },
    correo: {
        type: String,
        required: [true, "El correo electrónico es obligatorio."],
        trim: true,
        lowercase: true
    }
}, { timestamps: true });

module.exports = mongoose.model(
    "MiembroComisionArtes",
    MiembroComisionArtesSchema,
    "miembrosComisionArtes"
);