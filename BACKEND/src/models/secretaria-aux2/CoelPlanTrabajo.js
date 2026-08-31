const mongoose = require('mongoose');

const planTrabajoSchema = new mongoose.Schema({
    comision: {
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CoelPlanTrabajo', planTrabajoSchema);