const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'El usuario es obligatorio'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [4, 'La contraseña debe tener al menos 4 caracteres']
    },
    role: {
        type: String,
        required: [true, 'El rol es obligatorio'],
        enum: ['SECRETARIA_CONSEJO', 'SECRETARIA_AUXILIAR_1', 'SECRETARIA_AUXILIAR_2', 'ASISTENTE_EJECUTIVA', 'COORDINADORA']
    }
}, {
    timestamps: true,
    collection: 'usuarios'
});

// Método automático para encriptar contraseña al guardar/registrar
usuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método personalizado para comparar contraseñas en el Login
usuarioSchema.methods.compararPassword = async function (passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);