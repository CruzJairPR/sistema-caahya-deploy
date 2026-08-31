const mongoose = require('mongoose');

const mediaCarreraSchema = new mongoose.Schema({
    carreraId: {
        type: String,
        index: true,
        trim: true
    },
    tipoArchivo: {
        type: String,
        enum: ['sesiones', 'plan-trabajo'],
        trim: true
    },
    titulo: {
        type: String,
        required: true, 
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    comentarios: {
        type: String,
        trim: true
    },
    fechaArchivo: {
        type: String,
        trim: true
    },
    nombreArchivo: {
        type: String,
        required: true, 
        trim: true
    },
    archivoBase64: {
        type: String,
        required: true, 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MediaCarrera', mediaCarreraSchema, 'carreras_media');