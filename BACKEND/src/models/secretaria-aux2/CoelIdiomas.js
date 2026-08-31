const mongoose = require('mongoose');

const coelIdiomasSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    nombreArchivo: { type: String, required: true },
    archivoBase64: { type: String, required: true },
    idioma: { type: String, required: true },      
    tipoExamen: { type: String, required: true },    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CoelIdiomas', coelIdiomasSchema);