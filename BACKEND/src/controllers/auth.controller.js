const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

/**
 * @desc    Iniciar sesión (Login)
 * @route   POST /api/v1/auth/login
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Verificar que vengan ambos campos
        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Por favor ingresa usuario y contraseña' });
        }

        // 2. Buscar al usuario en la base de datos
        const usuario = await Usuario.findOne({ username });
        if (!usuario) {
            return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
        }

        // 3. Verificar si la contraseña coincide
        const esValido = await usuario.compararPassword(password);
        if (!esValido) {
            return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
        }

        // 4. Generar el Token JWT conteniendo el ID y el Rol
        const token = jwt.sign(
            { id: usuario._id, role: usuario.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(200).json({
            success: true,
            token,
            role: usuario.role
        });

    } catch (error) {
        console.error('❌ Error en Login:', error.message);
        res.status(500).json({ success: false, error: 'Error en el servidor durante el login' });
    }
};




module.exports = {
    login
};