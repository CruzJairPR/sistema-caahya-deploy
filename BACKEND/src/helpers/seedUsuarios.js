const Usuario = require('../models/usuario');

const inicializarUsuariosFijos = async () => {
    try {
        const totalUsuarios = await Usuario.countDocuments();
        if (totalUsuarios === 0) {
            const USUARIOS_FIJOS = [
                { username: "Secretaria del Consejo", password: "PasswordConsejo2026*", role: "SECRETARIA_CONSEJO" },
                { username: "Secretaria Auxiliar 1", password: "PasswordAuxiliar1*", role: "SECRETARIA_AUXILIAR_1" },
                { username: "Secretaria Auxiliar 2", password: "PasswordAuxiliar2*", role: "SECRETARIA_AUXILIAR_2" },
                { username: "Asistente Ejecutiva ", password: "PasswordAsistente*", role: "ASISTENTE_EJECUTIVA" },
                { username: "Coordinadora", password: "PasswordCoordinadora*", role: "COORDINADORA" }
            ];
            await Usuario.create(USUARIOS_FIJOS);
            console.log('✅ Usuarios oficiales creados automáticamente en el arranque.');
        }
    } catch (error) {
        console.error('❌ Error al auto-inicializar usuarios:', error.message);
    }
};

module.exports = inicializarUsuariosFijos;