const mongoose = require('mongoose');

const historiaSchema = new mongoose.Schema({
    carrera: {
        type: String,
        required: [true, 'La carrera es obligatoria'],
        trim: true

    },
    facu: {
        type: String,
        trim: true
    },
    sede: {
        type: String,
        required: [true, 'La sede es obligatoria'],
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


module.exports = mongoose.model('historia', historiaSchema, 'historia');    