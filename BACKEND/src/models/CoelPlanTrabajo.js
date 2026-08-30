const mongoose = require('mongoose');

const planTrabajoSchema = new mongoose.Schema({
    comision: { type: String, required: true }, // Identificador de la comisión
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    comentarios: { type: String, default: "" },         // <-- Nuevo campo agregado
    fechaArchivo: { type: String },        // <-- Nuevo campo agregado (fecha del documento)
    nombreArchivo: { type: String, required: true },
    archivoBase64: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CoelPlanTrabajo', planTrabajoSchema);