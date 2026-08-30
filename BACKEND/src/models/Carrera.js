const mongoose = require('mongoose');

const carreraItemSchema = new mongoose.Schema({
    carreraId: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    carrera: {
        type: String,
        trim: true
    },
    facu: {
        type: String,
        trim: true
    },
    sede: {
        type: String,
        trim: true
    },
    persona: {
        type: String,
        trim: true
    },
    nombramiento: {
        type: String,
        trim: true
    },
    correo: {
        type: String,
        trim: true
    },
    fechaInicio: {
        type: String,
        trim: true
    },
    fechaTermino: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CarreraItem', carreraItemSchema, 'carreras_miembros');