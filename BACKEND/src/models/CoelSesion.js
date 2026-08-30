const mongoose = require('mongoose');

const CoelSesionSchema = new mongoose.Schema({
    tipo: { type: String, required: true },
    categoria: { type: String, required: true },
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    nombreArchivo: String,
    archivoBase64: String,
}, { timestamps: true });

module.exports = mongoose.model('CoelSesion', CoelSesionSchema);