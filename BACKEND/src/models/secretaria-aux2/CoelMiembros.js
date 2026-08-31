const mongoose = require('mongoose');

const coelMiembrosSchema = new mongoose.Schema({
    idioma: {
        type: String,
        trim: true,
        enum: {
            values: ['Inglés', 'Francés', 'Alemán', 'Italiano', 'Portugués', 'Japonés', 'Chino', 'Náhuatl', 'Purépecha'],
            message: 'El idioma no es válido'
        },
        set: (v) => {
            if (!v) return undefined;
            const limpio = v.trim().toLowerCase();
            const capitalizado = limpio.charAt(0).toUpperCase() + limpio.slice(1);

            const mapaIdiomas = {
                'ingles': 'Inglés',
                'frances': 'Francés',
                'aleman': 'Alemán',
                'italiano': 'Italiano',
                'portugues': 'Portugués',
                'japones': 'Japonés',
                'chino': 'Chino',
                'nahuatl': 'Náhuatl',
                'purepecha': 'Purépecha'
            };

            const sinAcento = limpio.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return mapaIdiomas[sinAcento] || capitalizado;
        }
    },
    integrante: {
        type: String,
        trim: true,
        default: null
    },
    cargo: {
        type: String,
        trim: true,
        default: null
    },
    adscripcion: {
        type: String,
        trim: true,
        default: null
    },
    periodo_integrante: {
        periodo: { type: String, trim: true, default: null },
        fecha_inicio: { type: Date, default: null },
        fecha_final: { type: Date, default: null }
    },
    coordinacion: {
        es_coordinador: { type: Boolean, default: false },
        periodo: { type: String, trim: true, default: null },
        fecha_inicio: { type: Date, default: null },
        fecha_final: { type: Date, default: null }
    }
}, {
    timestamps: true,
    collection: 'Subcomision'
});

coelMiembrosSchema.index({ idioma: 1 });

module.exports = mongoose.models.CoelMiembro || mongoose.model('CoelMiembro', coelMiembrosSchema, 'Subcomision');