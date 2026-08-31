const mongoose = require('mongoose');

const materialesSchema = new mongoose.Schema({
    titulo: { type: String, required: true },          
    descripcion: { type: String, default: "" },       
    nombreArchivo: { type: String, required: true },   
    archivoBase64: { type: String, required: true },  
    tipoMaterial: { type: String, default: "" },       
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CoelMateriales', materialesSchema);