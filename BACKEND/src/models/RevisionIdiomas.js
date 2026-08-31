const mongoose = require('mongoose');

const revisionIdiomaSchema = new mongoose.Schema({
    idioma: {
        type: String,
        required: true,
        trim: true
    },
    tipoExamen: {
        type: String,
        required: true,
        enum: ['examen-de-dominio', 'examen-de-metodologia'],
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
        default: "",
        trim: true
    },
    fechaArchivo: {
        type: String,
    },
    nombreArchivo: {
        type: String,
    },
    archivoBase64: {
        type: String,
        required: true
    },
    fechaSubida: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RevisionIdioma', revisionIdiomaSchema);