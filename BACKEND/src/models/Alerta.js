const mongoose = require("mongoose");

const AlertaSchema = new mongoose.Schema(
    {
        rolDestino: {
            type: String,
            required: [true, "El rol de destino es obligatorio"],
            index: true, // Para que las consultas por rol vuelen en velocidad
        },
        titulo: {
            type: String,
            required: [true, "El título es obligatorio"],
            trim: true,
        },
        mensaje: {
            type: String,
            required: [true, "El mensaje es obligatorio"],
            trim: true,
        },
        leida: {
            type: Boolean,
            default: false,
        },
        referenciaId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false, // Opcional: ID del miembro o documento relacionado
        },
    },
    {
        timestamps: true, // Agrega createdAt y updatedAt automáticamente
    }
);

module.exports = mongoose.model("Alerta", AlertaSchema);