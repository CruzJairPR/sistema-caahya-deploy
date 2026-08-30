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
            // Normaliza el texto a minúsculas y capitaliza la primera letra para que coincida con el enum
            const limpio = v.trim().toLowerCase();
            const capitalizado = limpio.charAt(0).toUpperCase() + limpio.slice(1);

            // Mapeo opcional por si hay acentos especiales o variantes exactas
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

            // Quitar acentos temporalmente para buscar en el mapa si fuera necesario, o retornar el capitalizado
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
    // Periodo como integrante (todo opcional)
    periodo_integrante: {
        periodo: { type: String, trim: true, default: null },
        fecha_inicio: { type: Date, default: null },
        fecha_final: { type: Date, default: null }
    },
    // Bloque de coordinación (todo opcional)
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

// Exportamos el modelo con un nombre limpio y profesional
module.exports = mongoose.models.CoelMiembro || mongoose.model('CoelMiembro', coelMiembrosSchema, 'Subcomision');