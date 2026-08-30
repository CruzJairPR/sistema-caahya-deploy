const mongoose = require('mongoose');

const convocatoriaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    nombreArchivo: { type: String, required: true },
    archivoBase64: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CoelConvocatoria', convocatoriaSchema);