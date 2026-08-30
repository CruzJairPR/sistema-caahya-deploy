const mongoose = require('mongoose');

const miembroSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    entidad: { type: String },
    correoElectronico: { type: String },
    telefono1: { type: String, default: "" },
    telefono2: { type: String, default: "" },
    telefono3: { type: String, default: "" },
    correoSecretario1: { type: String, default: "" },
    correoSecretario2: { type: String, default: "" },
    correoSecretario3: { type: String, default: "" }
});

module.exports = mongoose.model('Miembro', miembroSchema);