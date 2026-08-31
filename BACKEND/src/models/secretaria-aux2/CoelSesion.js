const mongoose = require('mongoose');

const CoelSesionSchema = new mongoose.Schema({
    tipo: {
        type: String,
        trim: true
    },
    categoria: {
        type: String,
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
        type: String
    },
    nombreArchivo: {
        type: String,
        required: true
    },
    archivoBase64: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('CoelSesion', CoelSesionSchema);