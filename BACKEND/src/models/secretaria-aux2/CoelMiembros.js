const mongoose = require('mongoose');

const coelMiembrosSchema = new mongoose.Schema({
    idioma: {
        type: String,
        required: [true, 'El idioma es obligatorio'], // Agregado por seguridad ya que estaba como required en la tabla
        trim: true,
        set: (v) => {
            if (!v) return undefined;
            // Limpia espacios y convierte la primera letra en mayúscula automáticamente
            const limpio = v.trim();
            return limpio.charAt(0).toUpperCase() + limpio.slice(1);
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