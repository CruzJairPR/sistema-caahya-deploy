const mongoose = require('mongoose');

const ComisionPrideSchema = new mongoose.Schema(
    {
        'Número': { type: Number },
        'Entidad': { type: String },
        'Fuente de Designación': { type: String },
        'Tipo de Miembro': { type: String },
        'Miembro': { type: String },
        'Adscripción': { type: String },
        'Categoría y nivel': { type: String },
        'Periodo': { type: String },
        'Inicio': { type: String },
        'Término': { type: String },
        'Permanencia': { type: String },
        'Observaciones': { type: String },
        'Preferencias de áreas CAAHyA': { type: String },
        'Última modificación a la base': { type: String },
        'Miembro anterior': { type: String },
    },
    {
        timestamps: true,
        collection: 'comisiones_pride',
        strict: false, 
    }
);

module.exports = mongoose.model('ComisionPride', ComisionPrideSchema, 'comisiones_pride');