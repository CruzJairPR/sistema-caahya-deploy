const mongoose = require('mongoose');

const mediaCarreraSchema = new mongoose.Schema({
    carreraId: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    tipoArchivo: {
        type: String,
        required: true, // Aquí guardaremos 'sesiones' o 'plan-trabajo'
        enum: ['sesiones', 'plan-trabajo'],
        trim: true
    },
    titulo: {
        type: String,
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
        trim: true
    },
    archivoBase64: {
        type: String, // O la ruta/URL si decides guardarlo en servidor o nube
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MediaCarrera', mediaCarreraSchema, 'carreras_media');