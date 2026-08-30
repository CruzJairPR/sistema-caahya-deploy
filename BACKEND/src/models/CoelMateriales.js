const mongoose = require('mongoose');

const materialesSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    nombreArchivo: { type: String, required: true },
    archivoBase64: { type: String, required: true },
    tipoMaterial: { type: String, required: true }, // 'videos', 'ppt', 'pdf'
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CoelMateriales', materialesSchema);