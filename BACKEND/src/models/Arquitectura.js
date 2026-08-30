const mongoose = require('mongoose');

const arquitecturaSchema = new mongoose.Schema({
    carrera: {
        type: String,
        required: [true, 'La carrera es obligatoria'],
        trim: true

    },
    facu: {
        type: String,
        required: [true, 'La facultad es obligatoria'],
        alias: 'facultad',
        trim: true
    },
    persona: {
        type: String,
        required: [true, 'El nombre de la persona es obligatoria'],
        trim: true

    },
    nombramiento: {
        type: String,
        required: [true, 'El nombramiento es obligatorio'],
        trim: true

    },
    correo: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Arquitectura', arquitecturaSchema, 'arquitectura');    