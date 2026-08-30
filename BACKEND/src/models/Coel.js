//ccpa Coel 
const mongoose = require('mongoose');

const coelSchema = new mongoose.Schema({
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        trim: true

    },
    nombreCargo: {
        type: String,
        required: [true, 'El nombre y cargo son obligatorios'],
        alias: 'nombre_y_cargo',
        trim: true
    },
    adscripcion: {
        type: String,
        required: [true, 'La adscripción es obligatoria'],
        trim: true

    },
    periodo: {
        type: String,
        trim: true

    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Coel', coelSchema, 'coel');