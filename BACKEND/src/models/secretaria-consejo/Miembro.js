const mongoose = require('mongoose');

const miembroSchema = new mongoose.Schema({
    nombre: {
        type: String,
        default: ""
    },
    entidad: {
        type: String,
        default: ""
    },
    correo1: {
        type: String,
        default: ""
    },
    correo2: {
        type: String,
        default: ""
    },
    telefono1: {
        type: String,
        default: ""
    },
    telefono2: {
        type: String,
        default: ""
    },
    comentarios: {
        type: String,
        default: ""
    },

}, { timestamps: true });

module.exports = mongoose.model('Miembro', miembroSchema);