const mongoose = require('mongoose');

const PersonaSchema = new mongoose.Schema({
    nombre: { type: String, trim: true, default: "" },
    correo: { type: String, trim: true, lowercase: true, default: "" },
    telefono: { type: String, trim: true, default: "" }
}, { _id: false });

const directorioSchema = new mongoose.Schema({
    entidad: {
        type: String,
        trim: true,
        default: ""
    },
    director: {
        type: PersonaSchema,
        default: () => ({})
    },
    secretario: {
        type: PersonaSchema,
        default: () => ({})
    },
    cuerposColegiados: {
        type: [PersonaSchema],
        default: []
    }
}, {
    timestamps: true,
    collection: "directorio_entidades"
});

module.exports = mongoose.model('Directorio', directorioSchema);