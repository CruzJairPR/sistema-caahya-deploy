const mongoose = require('mongoose');

const difusionSchema = new mongoose.Schema({
    numero: {
        type: Number,
        alias: 'No.'
    },
    nombre: {
        type: String,
        alias: 'Nombre',
        trim: true
    },
    cargo: {
        type: String,
        alias: 'Cargo',
        trim: true
    },
    adscripcion: {
        type: String,
        alias: 'Adscripción',
        trim: true
    },
    correo: {
        type: String,
        alias: 'Correo',
        trim: true
    },
    correo2: {
        type: String,
        trim: true
    },
    telefono: {
        type: String,
        alias: 'Teléfono',
        trim: true
    },
    telefono2: {
        type: String,
        alias: 'Telefono2',
        trim: true
    },
    observaciones: {
        type: String,
        alias: 'Observaciones',
        trim: true
    },
    // Nuevos campos de fecha
    fechaInicio: {
        type: Date,
        alias: 'Fecha inicio'
    },
    fechaFin: {
        type: Date,
        alias: 'Fecha final'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Difusion', difusionSchema, 'comision_difusion_extension');